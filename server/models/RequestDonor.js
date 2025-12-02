const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const BloodRequest = require('./BloodRequest');
const Donor = require('./Donor');

const RequestDonor = sequelize.define('RequestDonor', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    requestId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: BloodRequest,
            key: 'id'
        }
    },
    donorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Donor,
            key: 'id'
        }
    },
    status: {
        type: DataTypes.ENUM('Pending', 'Accepted', 'Rejected'),
        defaultValue: 'Pending'
    }
}, {
    tableName: 'request_donors'
});

// Define associations
BloodRequest.hasMany(RequestDonor, { foreignKey: 'requestId', as: 'requestDonors' });
RequestDonor.belongsTo(BloodRequest, { foreignKey: 'requestId' });

Donor.hasMany(RequestDonor, { foreignKey: 'donorId' });
RequestDonor.belongsTo(Donor, { foreignKey: 'donorId' });

module.exports = RequestDonor;
