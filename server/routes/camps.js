const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const Camp = require('../models/Camp');
const { geocodeAddress } = require('../utils/geolocation');

// Get all camps
router.get('/', async (req, res) => {
  try {
    const { state, district, status, date } = req.query;
    const where = {};

    if (state) where.state = state;
    if (district && district !== 'All district') where.district = district;
    if (status) where.status = status;
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      where.campDate = {
        [Op.gte]: startDate,
        [Op.lt]: endDate
      };
    }

    const camps = await Camp.findAll({
      where,
      order: [['campDate', 'ASC']]
    });

    res.json(camps);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Register camp
router.post('/', async (req, res) => {
  try {
    const {
      organizationType,
      organizationName,
      organizer,
      organizerMobile,
      organizerEmail,
      coOrganizerName,
      coOrganizerMobile,
      campName,
      campAddress,
      state,
      district,
      cityName,
      bloodBank,
      campDate,
      startTime,
      endTime,
      estimatedParticipants,
      remarks
    } = req.body;

    // Get coordinates
    const coords = await geocodeAddress(campAddress, cityName, state);
    
    const camp = await Camp.create({
      organizationType,
      organizationName,
      organizer,
      organizerMobile,
      organizerEmail,
      coOrganizerName,
      coOrganizerMobile,
      campName,
      campAddress,
      state,
      district,
      cityName,
      bloodBank,
      campDate,
      startTime,
      endTime,
      estimatedParticipants,
      remarks,
      latitude: coords?.latitude,
      longitude: coords?.longitude
    });

    res.status(201).json({
      message: 'Camp registered successfully',
      camp
    });
  } catch (error) {
    console.error('Camp registration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single camp
router.get('/:id', async (req, res) => {
  try {
    const camp = await Camp.findByPk(req.params.id);
    if (!camp) {
      return res.status(404).json({ message: 'Camp not found' });
    }
    res.json(camp);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

