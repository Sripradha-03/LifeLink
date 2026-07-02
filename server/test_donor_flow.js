const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testDonorFlow() {
    try {
        const mobile = '9' + Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');
        console.log(`Testing with mobile: ${mobile}`);

        // 1. Register
        console.log('Registering...');
        const regRes = await axios.post(`${API_URL}/auth/register`, {
            name: 'Test Donor',
            age: 25,
            gender: 'Male',
            fatherName: 'Father',
            mobile: mobile,
            state: 'Tamil Nadu',
            district: 'Chennai',
            address: 'Test Address',
            pincode: '600001',
            bloodGroup: 'A+',
            password: 'password123'
        });
        console.log('Registration Status:', regRes.status);
        const token = regRes.data.token;

        // 2. Login (optional since register returns token, but good to test)
        console.log('Logging in...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            mobile: mobile,
            password: 'password123'
        });
        console.log('Login Status:', loginRes.status);

        // 3. Get Profile
        console.log('Fetching Profile...');
        const profileRes = await axios.get(`${API_URL}/donors/profile`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Profile Status:', profileRes.status);
        console.log('Profile Data:', profileRes.data);

    } catch (error) {
        console.error('Error Status:', error.response ? error.response.status : 'Unknown');
        console.error('Error Message:', error.message);
        if (error.response && error.response.data) {
            console.log('Error Data:', error.response.data);
        }
    }
}

testDonorFlow();
