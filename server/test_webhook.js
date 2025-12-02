const axios = require('axios');

async function testWebhook() {
    try {
        console.log('Simulating Incoming SMS Webhook...');

        // 1. First, ensure there is a pending request (we created one in previous steps)
        // We'll just try to accept whatever is latest.

        const response = await axios.post('http://localhost:5000/api/webhook/sms', {
            From: '+919380423971', // The verified donor number
            Body: 'ACCEPT'
        });

        console.log('Webhook Response Status:', response.status);
        console.log('Webhook Response Data:', response.data);

        // 2. Check if request status updated
        // We can't easily check DB here without connecting, but we can check logs or use another API endpoint.
        // Let's use the public API to check requests.

        const requestsResponse = await axios.get('http://localhost:5000/api/blood-requests');
        const latestRequest = requestsResponse.data[0];

        console.log('Latest Request Status:', latestRequest.status);
        console.log('Assigned Donor:', latestRequest.donor ? latestRequest.donor.name : 'None');

    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
    }
}

testWebhook();
