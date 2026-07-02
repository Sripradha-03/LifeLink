const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Donor = require('../models/Donor');
const { body, validationResult } = require('express-validator');
const { geocodeAddress } = require('../utils/geolocation');

// Register donor
router.post('/register', [
  body('mobile').isLength({ min: 10, max: 10 }).withMessage('Mobile must be 10 digits'),
  body('email').optional().isEmail().withMessage('Invalid email'),
  body('pincode').isLength({ min: 6, max: 6 }).withMessage('Pincode must be 6 digits')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, age, gender, fatherName, mobile, email, state, district, address, pincode, latitude, longitude, bloodGroup, password } = req.body;

    // Validate required fields
    if (!bloodGroup) {
      return res.status(400).json({ message: 'Blood group is required' });
    }

    // Check if donor already exists
    const existingDonor = await Donor.findOne({ where: { mobile } });
    if (existingDonor) {
      return res.status(400).json({ message: 'Donor with this mobile number already exists' });
    }

    // Get coordinates if not provided
    let finalLat = latitude;
    let finalLon = longitude;
    if (!latitude || !longitude) {
      const coords = await geocodeAddress(address, district, state);
      if (coords) {
        finalLat = coords.latitude;
        finalLon = coords.longitude;
      }
    }

    const donor = await Donor.create({
      name,
      age,
      gender,
      fatherName,
      mobile,
      email,
      state,
      district,
      address,
      pincode,
      latitude: finalLat,
      longitude: finalLon,
      bloodGroup,
      password: password || mobile, // Default password is mobile number
      status: 'Pending'
    });

    const token = jwt.sign(
      { id: donor.id, mobile: donor.mobile },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(201).json({
      message: 'Donor registered successfully',
      token,
      donor: {
        id: donor.id,
        name: donor.name,
        mobile: donor.mobile,
        bloodGroup: donor.bloodGroup
      }
    });
  } catch (error) {
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Validation error', errors: error.errors.map(e => e.message) });
    }
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login donor
router.post('/login', [
  body('mobile').isLength({ min: 10, max: 10 }).withMessage('Mobile must be 10 digits')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { mobile, password } = req.body;

    const donor = await Donor.findOne({ where: { mobile } });
    if (!donor) {
      return res.status(401).json({ message: 'Invalid mobile number or password' });
    }

    const isMatch = await donor.comparePassword(password || mobile);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid mobile number or password' });
    }

    const token = jwt.sign(
      { id: donor.id, mobile: donor.mobile },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      message: 'Login successful',
      token,
      donor: {
        id: donor.id,
        name: donor.name,
        mobile: donor.mobile,
        bloodGroup: donor.bloodGroup,
        state: donor.state,
        district: donor.district
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

