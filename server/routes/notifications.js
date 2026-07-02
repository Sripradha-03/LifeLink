const express = require('express');
const router = express.Router();
const BloodRequest = require('../models/BloodRequest');
const BloodStock = require('../models/BloodStock');
const Camp = require('../models/Camp');
const BloodCenter = require('../models/BloodCenter');

router.get('/', async (req, res) => {
    try {
        // Fetch recent data from all sources in parallel
        const [requests, stocks, camps, centers] = await Promise.all([
            BloodRequest.findAll({
                limit: 20,
                order: [['createdAt', 'DESC']],
                attributes: ['id', 'patientName', 'bloodGroup', 'hospitalName', 'city', 'state', 'isEmergency', 'unitsRequired', 'createdAt']
            }),
            BloodStock.findAll({
                limit: 20,
                order: [['updatedAt', 'DESC']],
                include: [{
                    model: BloodCenter,
                    as: 'bloodCenter',
                    attributes: ['name', 'city', 'state']
                }]
            }),
            Camp.findAll({
                limit: 20,
                order: [['createdAt', 'DESC']]
            }),
            BloodCenter.findAll({
                limit: 10,
                order: [['createdAt', 'DESC']]
            })
        ]);

        const notifications = [];

        // Process Blood Requests
        requests.forEach(req => {
            notifications.push({
                id: `req-${req.id}`,
                title: req.isEmergency ? 'Emergency Blood Needed' : 'Blood Request',
                message: `${req.bloodGroup} blood required ${req.isEmergency ? 'urgently ' : ''}at ${req.hospitalName} for ${req.patientName}. ${req.unitsRequired} units needed.`,
                type: req.isEmergency ? 'emergency' : 'update',
                timestamp: req.createdAt,
                location: `${req.city}, ${req.state}`
            });
        });

        // Process Stock Updates
        stocks.forEach(stock => {
            if (stock.bloodCenter) {
                notifications.push({
                    id: `stock-${stock.id}`,
                    title: 'Blood Stock Updated',
                    message: `${stock.bloodCenter.name} updated their blood stock availability.`,
                    type: 'update',
                    timestamp: stock.updatedAt,
                    location: `${stock.bloodCenter.city}, ${stock.bloodCenter.state}`
                });
            }
        });

        // Process Camps
        camps.forEach(camp => {
            // Calculate if camp is completed
            const campEnd = new Date(camp.campDate);
            if (camp.endTime) {
                const [hours, minutes] = camp.endTime.split(':');
                campEnd.setHours(parseInt(hours), parseInt(minutes), 0);
            } else {
                // Default to end of day if no time
                campEnd.setHours(23, 59, 59);
            }

            const isCompleted = new Date() > campEnd;
            const statusSuffix = isCompleted ? '(Completed)' : '(Pending)';

            notifications.push({
                id: `camp-${camp.id}`,
                title: `New Donation Camp ${statusSuffix}`,
                message: `${camp.organizationName} is organizing a blood donation camp on ${new Date(camp.campDate).toLocaleDateString()}.`,
                type: 'campaign',
                timestamp: camp.createdAt,
                location: `${camp.campAddress}, ${camp.cityName}`
            });
        });

        // Process New Centers
        centers.forEach(center => {
            notifications.push({
                id: `center-${center.id}`,
                title: 'New Blood Center Registered',
                message: `${center.name} has joined LifeLink network.`,
                type: 'update',
                timestamp: center.createdAt,
                location: `${center.city}, ${center.state}`
            });
        });

        // Sort by timestamp descending
        notifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        // Return top 50
        res.json(notifications.slice(0, 50));

    } catch (error) {
        console.error('Notification fetch error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
