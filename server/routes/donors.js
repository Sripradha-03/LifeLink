const express = require('express');
const router = express.Router();
const Donor = require('../models/Donor');
const { auth } = require('../middleware/auth');

// Get donor profile
router.get('/profile', auth, async (req, res) => {
  try {
    const donor = await Donor.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    res.json(donor);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update donor profile
router.put('/profile', auth, async (req, res) => {
  try {
    const donor = await Donor.findByPk(req.user.id);
    if (!donor) {
      return res.status(404).json({ message: 'Donor not found' });
    }

    await donor.update({
      ...req.body,
      status: 'Pending',
      isActive: false
    });

    const updatedDonor = await Donor.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });

    res.json({
      message: 'Profile updated successfully. Your account is now pending verification.',
      donor: updatedDonor
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update last donation date
router.post('/donation', auth, async (req, res) => {
  try {
    const donor = await Donor.findByPk(req.user.id);
    if (!donor) {
      return res.status(404).json({ message: 'Donor not found' });
    }

    const { donationDate } = req.body;

    await donor.update({
      lastDonationDate: donationDate || new Date(),
      isActive: false
    });

    res.json({
      message: 'Donation recorded successfully. You are now marked as unavailable.',
      donor
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all donors (for admin)
router.get('/', async (req, res) => {
  try {
    const { state, district, bloodGroup } = req.query;
    const where = {};

    if (state) where.state = state;
    if (district) where.district = district;
    if (bloodGroup) where.bloodGroup = bloodGroup;

    const donors = await Donor.findAll({
      where,
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']]
    });

    res.json(donors);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

