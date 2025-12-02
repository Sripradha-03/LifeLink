const express = require('express');
const router = express.Router();
const BloodStock = require('../models/BloodStock');
const BloodCenter = require('../models/BloodCenter');
const { Op } = require('sequelize');

// Search blood stocks
router.get('/search', async (req, res) => {
  try {
    const { state, district, bloodGroup, bloodComponent } = req.query;
    const where = {};

    if (bloodGroup && bloodGroup !== 'All Blood groups') {
      where.bloodGroup = bloodGroup;
    }
    if (bloodComponent && bloodComponent !== 'All Blood components') {
      where.bloodComponent = bloodComponent;
    }

    const stocks = await BloodStock.findAll({
      where,
      include: [{
        model: BloodCenter,
        as: 'bloodCenter',
        where: {
          ...(state && { state }),
          ...(district && { district }),
          isActive: true
        }
      }],
      order: [['bloodCenter', 'name', 'ASC']]
    });

    res.json(stocks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all blood stocks
router.get('/', async (req, res) => {
  try {
    const stocks = await BloodStock.findAll({
      include: [{
        model: BloodCenter,
        as: 'bloodCenter'
      }]
    });

    res.json(stocks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create/Update blood stock
router.post('/', async (req, res) => {
  try {
    const { bloodCenterId, bloodGroup, bloodComponent, unitsAvailable, expiryDate } = req.body;

    const [stock, created] = await BloodStock.findOrCreate({
      where: {
        bloodCenterId,
        bloodGroup,
        bloodComponent
      },
      defaults: {
        unitsAvailable,
        expiryDate
      }
    });

    if (!created) {
      stock.unitsAvailable = unitsAvailable;
      stock.expiryDate = expiryDate;
      await stock.save();
    }

    res.json({ message: 'Blood stock updated successfully', stock });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

