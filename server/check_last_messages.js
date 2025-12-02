require('dotenv').config();
const twilio = require('twilio');

const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

async function checkLastMessages() {
    try {
        console.log('Fetching last 5 messages...');
        const messages = await client.messages.list({ limit: 5 });

        messages.forEach(m => {
            console.log(`--------------------------------`);
            console.log(`SID: ${m.sid}`);
            console.log(`To: ${m.to}`);
            console.log(`From: ${m.from}`);
            console.log(`Status: ${m.status}`);
            console.log(`Date: ${m.dateCreated}`);
            if (m.errorCode) {
                console.log(`Error Code: ${m.errorCode}`);
                console.log(`Error Message: ${m.errorMessage}`);
            }
        });

    } catch (error) {
        console.error('Error:', error);
    }
}

checkLastMessages();
