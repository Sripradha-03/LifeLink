const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testBloodRequest() {
    try {
        console.log('Creating Blood Request...');
        const res = await axios.post(`${API_URL}/blood-requests`, {
            requesterName: 'Test Requester',
            patientName: 'Test Patient',
            hospitalName: 'Test Hospital',
            mobile: '9876543210',
            bloodGroup: 'A+',
            state: 'Tamil Nadu',
            city: 'Chennai',
            area: 'Anna Nagar',
            pincode: '600040',
            unitsRequired: 1,
            isEmergency: false
        });
        console.log('Status:', res.status);
        console.log('Data:', res.data);

        console.log('Fetching Blood Requests...');
        const getRes = await axios.get(`${API_URL}/blood-requests`);
        console.log('Get Status:', getRes.status);
        console.log('Get Count:', getRes.data.length);

    } catch (error) {
        console.error('Error Status:', error.response ? error.response.status : 'Unknown');
        console.error('Error Message:', error.message);
        if (error.response && error.response.data) {
            console.log('Error Data:', error.response.data);
        }
    }
}

testBloodRequest();
