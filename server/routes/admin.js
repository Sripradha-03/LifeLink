const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const Donor = require('../models/Donor');
const BloodRequest = require('../models/BloodRequest');
const BloodCenter = require('../models/BloodCenter');
const Camp = require('../models/Camp');
const BloodStock = require('../models/BloodStock');
const { adminAuth } = require('../middleware/auth');

// Get dashboard statistics
router.get('/dashboard', adminAuth, async (req, res) => {
  try {
    const totalDonors = await Donor.count();
    const activeDonors = await Donor.count({ where: { isActive: true } });
    const totalRequests = await BloodRequest.count();
    const pendingRequests = await BloodRequest.count({ where: { status: 'Pending' } });
    const emergencyRequests = await BloodRequest.count({ where: { isEmergency: true, status: 'Pending' } });
    const totalCenters = await BloodCenter.count();
    const totalCamps = await Camp.count();
    const upcomingCamps = await Camp.count({
      where: {
        campDate: {
          [Op.gte]: new Date()
        },
        status: 'Approved'
      }
    });

    res.json({
      donors: {
        total: totalDonors,
        active: activeDonors
      },
      requests: {
        total: totalRequests,
        pending: pendingRequests,
        emergency: emergencyRequests
      },
      centers: {
        total: totalCenters
      },
      camps: {
        total: totalCamps,
        upcoming: upcomingCamps
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

const RequestDonor = require('../models/RequestDonor');

// ...

// Get all requests
router.get('/requests', adminAuth, async (req, res) => {
  try {
    const requests = await BloodRequest.findAll({
      order: [['createdAt', 'DESC']],
      limit: 100,
      include: [
        {
          model: RequestDonor,
          as: 'requestDonors',
          include: [{
            model: Donor,
            attributes: ['id', 'name', 'mobile', 'bloodGroup']
          }]
        }
      ]
    });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all donors
router.get('/donors', adminAuth, async (req, res) => {
  try {
    const { status } = req.query;
    const where = {};
    if (status && status !== 'All') {
      where.status = status;
    }

    const donors = await Donor.findAll({
      where,
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']],
      limit: 100
    });
    res.json(donors);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update donor status
router.put('/donors/:id', adminAuth, async (req, res) => {
  try {
    const donor = await Donor.findByPk(req.params.id);
    if (!donor) {
      return res.status(404).json({ message: 'Donor not found' });
    }

    await donor.update(req.body);

    // If status is updated, update isActive accordingly
    if (req.body.status) {
      const isActive = req.body.status === 'Approved';
      await donor.update({ isActive });
    }

    res.json({ message: 'Donor updated successfully', donor });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update request status
router.put('/requests/:id', adminAuth, async (req, res) => {
  try {
    const request = await BloodRequest.findByPk(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    await request.update(req.body);
    res.json({ message: 'Request updated successfully', request });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update camp status
router.put('/camps/:id', adminAuth, async (req, res) => {
  try {
    const camp = await Camp.findByPk(req.params.id);
    if (!camp) {
      return res.status(404).json({ message: 'Camp not found' });
    }
    await camp.update(req.body);
    res.json({ message: 'Camp updated successfully', camp });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

