const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testStockFlow() {
    try {
        const username = 'center' + Math.floor(Math.random() * 10000).toString();
        console.log(`Testing with username: ${username}`);

        // 1. Create Center
        console.log('Creating Center...');
        const createRes = await axios.post(`${API_URL}/blood-centers`, {
            name: 'Test Center',
            username: username,
            password: 'password123',
            state: 'Tamil Nadu',
            district: 'Chennai',
            city: 'Chennai',
            address: 'Test Address',
            pincode: '600001',
            contactNumber: '1234567890',
            type: 'Blood Bank',
            latitude: 13.0827,
            longitude: 80.2707
        }, {
            headers: { 'X-Admin-Key': process.env.ADMIN_SECRET || 'admin-secret-key' } // Assuming default or env
        });
        console.log('Create Status:', createRes.status);
        const centerId = createRes.data.center.id;

        // 2. Login Center
        console.log('Logging in...');
        const loginRes = await axios.post(`${API_URL}/blood-centers/login`, {
            username: username,
            password: 'password123'
        });
        console.log('Login Status:', loginRes.status);
        const token = loginRes.data.token;

        // 3. Add Stock
        console.log('Adding Stock...');
        const stockRes = await axios.post(`${API_URL}/blood-stocks`, {
            bloodCenterId: centerId,
            bloodGroup: 'A+',
            bloodComponent: 'Whole Blood',
            unitsAvailable: 10,
            expiryDate: '2025-12-31'
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Add Stock Status:', stockRes.status);

        // 4. Search Stock
        console.log('Searching Stock...');
        const searchRes = await axios.get(`${API_URL}/blood-stocks/search?state=Tamil%20Nadu&bloodGroup=A%2B`);
        console.log('Search Status:', searchRes.status);
        console.log('Search Data Length:', searchRes.data.length);

    } catch (error) {
        console.error('Error Status:', error.response ? error.response.status : 'Unknown');
        console.error('Error Message:', error.message);
        if (error.response && error.response.data) {
            console.log('Error Data:', error.response.data);
        }
    }
}

testStockFlow();
