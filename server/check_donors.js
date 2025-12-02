require('dotenv').config();
const Donor = require('./models/Donor');
const sequelize = require('./config/database');

async function checkDonors() {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        const donors = await Donor.findAll();
        console.log(`Total Donors: ${donors.length}`);

        donors.forEach(d => {
            console.log(`ID: ${d.id}, Name: ${d.name}, Group: ${d.bloodGroup}, Status: ${d.status}, Active: ${d.isActive}, Lat: ${d.latitude}, Lon: ${d.longitude}`);
        });

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
}

checkDonors();
