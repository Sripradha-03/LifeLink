const axios = require('axios');
const { Sequelize } = require('sequelize');
const config = require('./config/database'); // Adjust path if needed

// Let's assume we can query the DB.
const sequelize = require('./config/database');
const RequestDonor = require('./models/RequestDonor');
const Donor = require('./models/Donor');
const BloodRequest = require('./models/BloodRequest');

async function simulate() {
    try {
        await sequelize.authenticate();
        console.log('Connected to DB');

        // Find a pending request donor
        const pending = await RequestDonor.findOne({
            where: { status: 'Pending' },
            include: [{ model: Donor }]
        });

        if (!pending) {
            console.log('No pending requests found to simulate.');
            return;
        }

        const donorMobile = pending.Donor.mobile;
        console.log(`Found pending request for Donor: ${pending.Donor.name} (${donorMobile})`);

        // Simulate Webhook
        const payload = {
            From: `+91${donorMobile}`, // Ensure format matches what webhook expects
            Body: 'YES'
        };

        console.log('Sending Webhook Payload:', payload);

        try {
            const response = await axios.post('http://localhost:5000/api/blood-requests/webhook', payload);
            console.log('Webhook Response:', response.status, response.data);
            console.log('SUCCESS: SMS simulated. Check the dashboard!');
        } catch (err) {
            console.error('Webhook failed:', err.message);
            if (err.response) console.error(err.response.data);
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
}

simulate();
