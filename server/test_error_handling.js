const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testErrorHandling() {
    try {
        console.log('Testing Blood Center Creation with missing fields...');
        try {
            await axios.post(`${API_URL}/blood-centers`, {
                name: 'Test Center'
                // Missing contactNumber, etc.
            });
        } catch (error) {
            console.log('Blood Center Status:', error.response ? error.response.status : 'Unknown');
            if (error.response && error.response.data) {
                console.log('Blood Center Error:', error.response.data);
            }
        }

        console.log('Testing Camp Creation with missing fields...');
        try {
            await axios.post(`${API_URL}/camps`, {
                campName: 'Test Camp'
                // Missing bloodBank, etc.
            });
        } catch (error) {
            console.log('Camp Status:', error.response ? error.response.status : 'Unknown');
            if (error.response && error.response.data) {
                console.log('Camp Error:', error.response.data);
            }
        }

    } catch (error) {
        console.error('Unexpected Error:', error);
    }
}

testErrorHandling();
