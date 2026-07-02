const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./config/database');

dotenv.config();

// Initialize models and associations
require('./models');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/donors', require('./routes/donors'));
app.use('/api/blood-requests', require('./routes/bloodRequests'));
app.use('/api/blood-stocks', require('./routes/bloodStocks'));
app.use('/api/blood-centers', require('./routes/bloodCenters'));
app.use('/api/camps', require('./routes/camps'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/webhook', require('./routes/webhook'));
app.use('/api/notifications', require('./routes/notifications'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Lifelink API is running' });
});

// Database connection and server start
const PORT = process.env.PORT || 5000;

sequelize.authenticate()
  .then(() => {
    console.log('Database connected successfully');
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Unable to connect to database:', err);
  });

// Scheduled task to reactivate eligible donors (runs every hour)
const Donor = require('./models/Donor');
const { Op } = require('sequelize');

setInterval(async () => {
  try {
    const donors = await Donor.findAll({
      where: {
        isActive: false,
        status: 'Approved',
        lastDonationDate: {
          [Op.not]: null
        }
      }
    });

    const now = new Date();
    for (const donor of donors) {
      const lastDonation = new Date(donor.lastDonationDate);
      const eligibilityMonths = donor.gender === 'Female' ? 4 : 3;
      const eligibilityDate = new Date(lastDonation.setMonth(lastDonation.getMonth() + eligibilityMonths));

      if (now >= eligibilityDate) {
        await donor.update({ isActive: true });
        console.log(`Reactivated donor ${donor.id}`);
      }
    }
  } catch (error) {
    console.error('Error in reactivation task:', error);
  }
}, 60 * 60 * 1000); // Run every hour

module.exports = app;

