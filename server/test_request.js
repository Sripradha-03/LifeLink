const axios = require('axios');

async function testRequest() {
    try {
        const response = await axios.post('http://localhost:5000/api/blood-requests', {
            patientName: "Test Patient",
            bloodGroup: "A+",
            latitude: 13.94,
            longitude: 75.57,
            mobile: "1234567890",
            pincode: "577201",
            state: "Karnataka",
            city: "Shivamogga",
            hospitalName: "Test Hospital",
            requesterName: "Tester",
            area: "Test Area"
        });

        console.log('Response Status:', response.status);
        console.log('Matching Donors:', response.data.matchingDonors.length);
        console.log('Donors:', JSON.stringify(response.data.matchingDonors, null, 2));

    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
    }
}

testRequest();
