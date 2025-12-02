require('dotenv').config();
const { sendEmergencyBloodRequest } = require('./utils/twilio');

async function testSMS() {
    try {
        console.log('Testing Twilio SMS...');
        // Using a dummy number for now, user might need to provide a real one or check logs
        // Ideally, we should use a verified number if in trial mode
        const testNumber = '+919380423971';

        console.log(`Sending SMS to ${testNumber}...`);

        const result = await sendEmergencyBloodRequest(testNumber, {
            id: 123,
            patientName: "Test Patient",
            bloodGroup: "A+",
            hospitalName: "Test Hospital",
            city: "Test City",
            state: "Test State",
            unitsRequired: 1
        });

        console.log('Result:', result);

    } catch (error) {
        console.error('Test Error:', error);
    }
}

testSMS();
