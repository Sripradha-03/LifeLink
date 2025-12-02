const express = require('express');
const router = express.Router();
const BloodRequest = require('../models/BloodRequest');
const Donor = require('../models/Donor');
const { sendSMS } = require('../utils/twilio');
const { Op } = require('sequelize');

router.post('/sms', async (req, res) => {
    try {
        const { From, Body } = req.body;
        console.log(`Received SMS from ${From}: ${Body}`);

        // Sanitize sender number (remove +91 or other prefixes to match DB if stored without)
        // Actually, DB might have it with or without. 
        // Best to search both formats or sanitize both.
        // Our DB seems to have "9380423971" (no +91).
        // Incoming From will be "+919380423971".

        const sanitizedMobile = From.replace(/^\+91/, '').replace(/^\+1/, ''); // Remove country code
        // A more robust way: search where mobile like %last_10_digits%
        const last10 = From.slice(-10);

        const donor = await Donor.findOne({
            where: {
                mobile: {
                    [Op.like]: `%${last10}`
                }
            }
        });

        if (!donor) {
            console.log('Donor not found for mobile:', From);
            return res.status(200).send('Donor not found'); // Twilio expects 200
        }

        const message = Body.trim().toUpperCase();

        if (message.startsWith('ACCEPT')) {
            // Try to extract ID
            const parts = message.split(' ');
            let requestId = parts[1];
            let request;

            if (requestId) {
                request = await BloodRequest.findByPk(requestId);
            } else {
                // Find latest pending emergency request compatible with donor
                // For MVP, just latest pending emergency request
                request = await BloodRequest.findOne({
                    where: {
                        status: 'Pending',
                        isEmergency: true
                    },
                    order: [['createdAt', 'DESC']]
                });
            }

            if (request) {
                if (request.status !== 'Pending') {
                    await sendSMS(From, `Request #${request.id} is already ${request.status}.`);
                } else {
                    await request.update({
                        status: 'Accepted',
                        donorId: donor.id
                    });

                    console.log(`Request ${request.id} accepted by donor ${donor.id}`);

                    // Notify Donor
                    await sendSMS(From, `Thank you! You have accepted the request for ${request.patientName}. Please proceed to ${request.hospitalName}.`);

                    // Notify Requester
                    if (request.mobile) {
                        await sendSMS(request.mobile, `Good news! A donor (${donor.name}, ${donor.mobile}) has accepted your request.`);
                    }
                }
            } else {
                await sendSMS(From, 'No pending emergency request found.');
            }
        } else if (message.startsWith('REJECT')) {
            // Log rejection (optional)
            console.log(`Donor ${donor.id} rejected request.`);
        }

        res.status(200).send('<Response></Response>'); // Empty TwiML response

    } catch (error) {
        console.error('Webhook Error:', error);
        res.status(500).send('Error');
    }
});

module.exports = router;
