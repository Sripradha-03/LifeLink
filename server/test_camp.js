const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testCampAndNotifications() {
    try {
        // 1. Create Camp
        console.log('Creating Camp...');
        const campRes = await axios.post(`${API_URL}/camps`, {
            organizationType: 'NGO',
            organizationName: 'Test NGO',
            organizer: 'Organizer Name',
            organizerMobile: '9876543210',
            organizerEmail: 'test@example.com',
            campName: 'Test Camp',
            campAddress: 'Test Address',
            state: 'Tamil Nadu',
            district: 'Chennai',
            cityName: 'Chennai',
            bloodBank: 'Red Cross',
            campDate: '2025-12-25',
            startTime: '09:00',
            endTime: '17:00',
            estimatedParticipants: 100
        });
        console.log('Camp Create Status:', campRes.status);

        // 2. Get Notifications
        console.log('Fetching Notifications...');
        const notifRes = await axios.get(`${API_URL}/notifications`);
        console.log('Notifications Status:', notifRes.status);
        console.log('Notifications Count:', notifRes.data.length);

    } catch (error) {
        console.error('Error Status:', error.response ? error.response.status : 'Unknown');
        console.error('Error Message:', error.message);
        if (error.response && error.response.data) {
            console.log('Error Data:', error.response.data);
        }
    }
}

testCampAndNotifications();
