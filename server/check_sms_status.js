require('dotenv').config();
const twilio = require('twilio');

const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

async function checkStatus() {
    try {
        const sid = 'SM8621244aa7cc38530e778994d71560458'; // SID from previous success log
        console.log(`Checking status for SID: ${sid}`);

        const message = await client.messages(sid).fetch();
        console.log('Message Status:', message.status);
        console.log('Error Code:', message.errorCode);
        console.log('Error Message:', message.errorMessage);

    } catch (error) {
        console.error('Error:', error);
    }
}

checkStatus();
