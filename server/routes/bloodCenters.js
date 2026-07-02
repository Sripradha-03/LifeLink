const express = require('express');
const router = express.Router();
const BloodCenter = require('../models/BloodCenter');
const { calculateDistance, geocodeAddress } = require('../utils/geolocation');
const { Op } = require('sequelize');

// Get all blood centers
router.get('/', async (req, res) => {
  try {
    const { state, district, type, name } = req.query;
    const adminKey = req.headers['x-admin-key'];

    // If admin key is present and valid (simple check), show all. Otherwise only active.
    // In a real app, validate the key against env var.
    const isAdmin = adminKey && adminKey === process.env.ADMIN_SECRET; // Assuming simple check or just presence if not strict

    const where = {};
    if (!isAdmin) {
      where.isActive = true;
    }

    if (state) where.state = state;
    if (district) where.district = district;
    if (type) where.type = type;
    if (name) {
      where.name = {
        [Op.iLike]: `%${name}%`
      };
    }

    const centers = await BloodCenter.findAll({
      where,
      order: [['name', 'ASC']]
    });

    res.json(centers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Find nearest blood centers
router.get('/nearest', async (req, res) => {
  try {
    const { latitude, longitude, state, district, type } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }

    const where = { isActive: true };
    if (state) where.state = state;
    if (district) where.district = district;
    if (type) where.type = type;

    const centers = await BloodCenter.findAll({ where });

    const centersWithDistance = centers
      .filter(center => center.latitude && center.longitude)
      .map(center => {
        const distance = calculateDistance(
          parseFloat(latitude),
          parseFloat(longitude),
          parseFloat(center.latitude),
          parseFloat(center.longitude)
        );
        return {
          ...center.toJSON(),
          distance: distance.toFixed(2)
        };
      })
      .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

    res.json(centersWithDistance);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ... (existing imports)

// Create blood center
router.post('/', async (req, res) => {
  try {
    const adminKey = req.headers['x-admin-key'];
    // If no admin key, force isActive to false
    const centerData = { ...req.body };
    if (!adminKey) {
      centerData.isActive = false;
    }

    // Handle Authentication (if credentials provided)
    if (centerData.username && centerData.password) {
      // Check if username exists
      const existingUser = await BloodCenter.findOne({ where: { username: centerData.username } });
      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      centerData.password = await bcrypt.hash(centerData.password, salt);
    } else {
      // Ensure we don't save empty strings as username/password
      centerData.username = null;
      centerData.password = null;
    }

    // Sanitize numeric fields
    if (centerData.latitude === '' || isNaN(parseFloat(centerData.latitude))) {
      centerData.latitude = null;
    }
    if (centerData.longitude === '' || isNaN(parseFloat(centerData.longitude))) {
      centerData.longitude = null;
    }

    // Geocode if coordinates are missing
    if (!centerData.latitude || !centerData.longitude) {
      try {
        const addressString = `${centerData.address}, ${centerData.city}, ${centerData.district}`;
        const coords = await geocodeAddress(addressString, centerData.city, centerData.state);
        if (coords) {
          centerData.latitude = coords.latitude;
          centerData.longitude = coords.longitude;
        }
      } catch (geoError) {
        console.error('Geocoding failed:', geoError);
        // Continue without coordinates
      }
    }

    const center = await BloodCenter.create(centerData);
    res.status(201).json({ message: 'Blood center created successfully', center });
  } catch (error) {
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Validation error', errors: error.errors.map(e => e.message) });
    }
    console.error('Error creating blood center:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login Blood Center
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if center exists
    const center = await BloodCenter.findOne({ where: { username } });
    if (!center) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, center.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (!center.isActive) {
      return res.status(403).json({ message: 'Account is pending verification' });
    }

    // Create token
    const payload = {
      center: {
        id: center.id,
        name: center.name
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '24h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token, center: { id: center.id, name: center.name } });
      }
    );
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update blood center (Admin only)
router.put('/:id', async (req, res) => {
  try {
    const adminKey = req.headers['x-admin-key'];
    if (!adminKey || adminKey !== process.env.ADMIN_SECRET) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { id } = req.params;
    const center = await BloodCenter.findByPk(id);

    if (!center) {
      return res.status(404).json({ message: 'Blood center not found' });
    }

    await center.update(req.body);
    res.json({ message: 'Blood center updated successfully', center });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

