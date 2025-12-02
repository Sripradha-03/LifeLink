const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const BloodRequest = sequelize.define('BloodRequest', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  requesterName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  patientName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  hospitalName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  mobile: {
    type: DataTypes.STRING,
    allowNull: false
  },
  bloodGroup: {
    type: DataTypes.ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'),
    allowNull: false
  },
  state: {
    type: DataTypes.STRING,
    allowNull: false
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false
  },
  area: {
    type: DataTypes.STRING,
    allowNull: false
  },
  pincode: {
    type: DataTypes.STRING,
    allowNull: false
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: true
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: true
  },
  isEmergency: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Accepted', 'Completed', 'Cancelled'),
    defaultValue: 'Pending'
  },
  unitsRequired: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  donorId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'donors',
      key: 'id'
    }
  }
}, {
  tableName: 'blood_requests'
});

module.exports = BloodRequest;

