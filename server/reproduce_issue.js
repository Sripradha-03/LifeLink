const axios = require('axios');

async function testCenters() {
    try {
        console.log('Testing /api/blood-centers...');
        const response = await axios.get('http://localhost:5000/api/blood-centers');
        console.log('Status:', response.status);
        console.log('Data:', response.data);
    } catch (error) {
        console.error('Error Status:', error.response ? error.response.status : 'Unknown');
        console.error('Error Message:', error.message);
        if (error.response && error.response.data) {
            console.log('Error Data:', error.response.data);
        }
    }
}

testCenters();
