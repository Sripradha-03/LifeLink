const axios = require('axios');

async function testFallback() {
    try {
        console.log('Testing Fallback with obscure area (Emergency Mode)...');
        const response = await axios.post('http://localhost:5000/api/blood-requests', {
            patientName: "Fallback Patient",
            bloodGroup: "A+",
            mobile: "123",
            pincode: "577201",
            state: "Karnataka",
            city: "Shivamogga",
            area: "NonExistentAreaXYZ123", // Intentionally obscure to fail geocoding
            hospitalName: "Test Hospital",
            requesterName: "Tester",
            isEmergency: true
        });

        console.log('Response Status:', response.status);
        console.log('Matching Donors:', response.data.matchingDonors.length);
        if (response.data.matchingDonors.length > 0) {
            console.log('First Donor:', response.data.matchingDonors[0].name);
            console.log('Distance:', response.data.matchingDonors[0].distance);
        } else {
            console.log('No donors found.');
        }

    } catch (error) {
        console.error('Error Status:', error.response?.status);
        console.error('Error Data:', JSON.stringify(error.response?.data, null, 2));
        console.error('Error Message:', error.message);
    }
}

testFallback();
