const express = require('express');
const router = express.Router();
const BloodRequest = require('../models/BloodRequest');
const Donor = require('../models/Donor');
const RequestDonor = require('../models/RequestDonor');
const { Op } = require('sequelize');
const { body, validationResult } = require('express-validator');
const { geocodeAddress, findNearestDonors } = require('../utils/geolocation');
const { sendEmergencyBloodRequest } = require('../utils/twilio');

// Create blood request
router.post('/', [
  body('mobile').isLength({ min: 10, max: 10 }).withMessage('Mobile must be 10 digits'),
  body('pincode').isLength({ min: 6, max: 6 }).withMessage('Pincode must be 6 digits')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      requesterName,
      patientName,
      hospitalName,
      mobile,
      bloodGroup,
      state,
      city,
      area,
      pincode,
      latitude,
      longitude,
      isEmergency,
      unitsRequired
    } = req.body;

    // Get coordinates if not provided
    let finalLat = latitude;
    let finalLon = longitude;
    if (!latitude || !longitude) {
      const coords = await geocodeAddress(`${area}, ${city}`, city, state);
      if (coords) {
        finalLat = coords.latitude;
        finalLon = coords.longitude;
      }
    }

    const request = await BloodRequest.create({
      requesterName,
      patientName,
      hospitalName,
      mobile,
      bloodGroup,
      state,
      city,
      area,
      pincode,
      latitude: finalLat,
      longitude: finalLon,
      isEmergency: isEmergency || false,
      unitsRequired: unitsRequired || 1
    });

    // Find nearest donors
    let matchingDonors = [];
    const compatibleBloodGroups = getCompatibleBloodGroups(bloodGroup);
    console.log('Compatible blood groups:', compatibleBloodGroups);

    if (finalLat && finalLon) {
      console.log(`Searching for donors near: ${finalLat}, ${finalLon}`);

      const donors = await Donor.findAll({
        where: {
          bloodGroup: compatibleBloodGroups,
          isActive: true,
          status: 'Approved'
        },
        attributes: { exclude: ['password'] }
      });

      console.log(`Found ${donors.length} potential donors in DB (Active & Approved)`);

      const nearestDonors = findNearestDonors(donors, finalLat, finalLon, 50);
      console.log(`Found ${nearestDonors.length} donors within 50km radius`);

      matchingDonors = nearestDonors.slice(0, 10);
    }

    // Fallback: If geocoding failed OR no donors found by distance, search by City/District
    if (matchingDonors.length === 0) {
      console.log('No donors found by distance or geocoding failed. Falling back to City/District search.');
      const fallbackDonors = await Donor.findAll({
        where: {
          bloodGroup: compatibleBloodGroups,
          isActive: true,
          status: 'Approved',
          [Op.or]: [
            { district: { [Op.iLike]: `%${city}%` } },
            { address: { [Op.iLike]: `%${city}%` } }
          ]
        },
        attributes: { exclude: ['password'] },
        limit: 10
      });

      // Add distance field to fallback donors
      const { calculateDistance } = require('../utils/geolocation');
      matchingDonors = fallbackDonors.map(donor => {
        const donorData = donor.toJSON();
        // Calculate distance if coordinates are available
        if (finalLat && finalLon && donor.latitude && donor.longitude) {
          const distance = calculateDistance(
            parseFloat(donor.latitude),
            parseFloat(donor.longitude),
            parseFloat(finalLat),
            parseFloat(finalLon)
          );
          donorData.distance = distance.toFixed(2);
        } else {
          donorData.distance = 'N/A'; // No coordinates available
        }
        return donorData;
      });

      console.log(`Found ${matchingDonors.length} donors by City/District fallback`);
    }

    // If emergency, send SMS to matching donors AND create RequestDonor entries
    if (isEmergency && matchingDonors.length > 0) {
      for (const donor of matchingDonors) {
        // Create RequestDonor entry
        await RequestDonor.create({
          requestId: request.id,
          donorId: donor.id,
          status: 'Pending'
        });

        console.log(`Attempting to send SMS to Donor ID: ${donor.id}, Mobile: ${donor.mobile}`);
        try {
          const result = await sendEmergencyBloodRequest(donor.mobile, {
            id: request.id,
            patientName,
            bloodGroup,
            hospitalName,
            city,
            state,
            unitsRequired: unitsRequired || 1
          });
          console.log(`SMS Result for ${donor.mobile}:`, result);
        } catch (smsError) {
          console.error(`Failed to send SMS to ${donor.mobile}:`, smsError);
        }
      }
    }

    res.status(201).json({
      message: 'Blood request created successfully',
      request,
      matchingDonors
    });
  } catch (error) {
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Validation error', errors: error.errors.map(e => e.message) });
    }
    console.error('Blood request error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// SMS Webhook to handle replies
router.post('/webhook', async (req, res) => {
  try {
    const { From, Body } = req.body;
    console.log(`Received SMS from ${From}: ${Body}`);

    if (!From || !Body) {
      return res.status(400).send('Invalid request');
    }

    // Normalize mobile number (remove +91 prefix if present for DB search)
    // Assuming DB stores 10 digits. Twilio sends +91XXXXXXXXXX
    const mobile = From.replace('+91', '').trim();
    const message = Body.trim().toUpperCase();

    // Find donor
    const donor = await Donor.findOne({ where: { mobile } });
    if (!donor) {
      console.log('Donor not found for mobile:', mobile);
      return res.status(404).send('Donor not found');
    }

    // Find the latest PENDING request for this donor
    const requestDonor = await RequestDonor.findOne({
      where: {
        donorId: donor.id,
        status: 'Pending'
      },
      order: [['createdAt', 'DESC']],
      include: [{ model: BloodRequest }]
    });

    if (!requestDonor) {
      console.log('No pending request found for donor:', donor.id);
      return res.status(200).send('No pending request');
    }

    if (message.includes('ACCEPT') || message.includes('YES')) {
      // Update status to Accepted
      await requestDonor.update({ status: 'Accepted' });

      // Update parent request to Accepted and assign donor
      await requestDonor.BloodRequest.update({
        status: 'Accepted',
        donorId: donor.id
      });

      console.log(`Request ${requestDonor.requestId} ACCEPTED by donor ${donor.id}`);
      // Ideally send a confirmation SMS back to donor
    } else if (message.includes('REJECT') || message.includes('NO')) {
      // Update status to Rejected
      await requestDonor.update({ status: 'Rejected' });
      console.log(`Request ${requestDonor.requestId} REJECTED by donor ${donor.id}`);
    } else {
      console.log('Unknown message content');
    }

    res.status(200).send('<Response></Response>');
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).send('Server error');
  }
});

// Get all blood requests
router.get('/', async (req, res) => {
  try {
    const { state, city, bloodGroup, status, isEmergency } = req.query;
    const where = {};

    if (state) where.state = state;
    if (city) where.city = city;
    if (bloodGroup) where.bloodGroup = bloodGroup;
    if (status) where.status = status;
    if (isEmergency !== undefined) where.isEmergency = isEmergency === 'true';

    const requests = await BloodRequest.findAll({
      where,
      include: [
        {
          model: Donor,
          as: 'donor',
          attributes: ['id', 'name', 'mobile', 'bloodGroup']
        },
        {
          model: RequestDonor,
          as: 'requestDonors',
          include: [{
            model: Donor,
            attributes: ['id', 'name', 'mobile']
          }]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single blood request
router.get('/:id', async (req, res) => {
  try {
    const request = await BloodRequest.findByPk(req.params.id, {
      include: [
        {
          model: Donor,
          as: 'donor',
          attributes: ['id', 'name', 'mobile', 'bloodGroup']
        },
        {
          model: RequestDonor,
          as: 'requestDonors',
          include: [{
            model: Donor,
            attributes: ['id', 'name', 'mobile']
          }]
        }
      ]
    });

    if (!request) {
      return res.status(404).json({ message: 'Blood request not found' });
    }

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update blood request status
router.put('/:id', async (req, res) => {
  try {
    const request = await BloodRequest.findByPk(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Blood request not found' });
    }

    await request.update(req.body);
    res.json({ message: 'Request updated successfully', request });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Helper function to get compatible blood groups
function getCompatibleBloodGroups(bloodGroup) {
  const compatibility = {
    'A+': ['A+', 'A-', 'O+', 'O-'],
    'A-': ['A-', 'O-'],
    'B+': ['B+', 'B-', 'O+', 'O-'],
    'B-': ['B-', 'O-'],
    'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    'AB-': ['A-', 'B-', 'AB-', 'O-'],
    'O+': ['O+', 'O-'],
    'O-': ['O-']
  };
  return compatibility[bloodGroup] || [];
}

module.exports = router;

