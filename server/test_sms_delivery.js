require('dotenv').config();
const twilio = require('twilio');

const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

async function testAndCheck() {
    try {
        let fromNumber = process.env.TWILIO_PHONE_NUMBER;
        if (!fromNumber.startsWith('+')) {
            fromNumber = `+91${fromNumber}`; // Assuming India default
        }
        // If the env var is US number (starts with +1), we shouldn't add +91. 
        // The previous log showed "Sending SMS from: +19894029549", so the env var likely has +1 or just the digits.
        // If it's just digits 1989..., adding +91 would be wrong.
        // Let's trust the env var if it starts with +

        // Actually, let's just use the hardcoded verified number for TO
        const to = '+919380423971';

        // For FROM, let's rely on what worked before: +19894029549
        // If process.env.TWILIO_PHONE_NUMBER is 19894029549, we need to add +

        let sender = process.env.TWILIO_PHONE_NUMBER;
        if (!sender.startsWith('+')) {
            sender = '+' + sender;
        }

        console.log(`Sending from ${sender} to ${to}`);

        const message = await client.messages.create({
            body: "Test SMS from Lifelink - Reply if received",
            from: sender,
            to: to
        });

        console.log(`Sent! SID: ${message.sid}`);
        console.log(`Initial Status: ${message.status}`);

        // Wait a bit and check status
        console.log('Waiting 5 seconds to check delivery status...');
        await new Promise(resolve => setTimeout(resolve, 5000));

        const updatedMessage = await client.messages(message.sid).fetch();
        console.log(`Updated Status: ${updatedMessage.status}`);
        console.log(`Error Code: ${updatedMessage.errorCode}`);
        console.log(`Error Message: ${updatedMessage.errorMessage}`);

    } catch (error) {
        console.error('Error:', error);
    }
}

testAndCheck();
