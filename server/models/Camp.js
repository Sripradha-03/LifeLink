const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Camp = sequelize.define('Camp', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  organizationType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  organizationName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  organizer: {
    type: DataTypes.STRING,
    allowNull: false
  },
  organizerMobile: {
    type: DataTypes.STRING,
    allowNull: false
  },
  organizerEmail: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  coOrganizerName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  coOrganizerMobile: {
    type: DataTypes.STRING,
    allowNull: true
  },
  campName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  campAddress: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  state: {
    type: DataTypes.STRING,
    allowNull: false
  },
  district: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cityName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  bloodBank: {
    type: DataTypes.STRING,
    allowNull: false
  },
  campDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  startTime: {
    type: DataTypes.TIME,
    allowNull: false
  },
  endTime: {
    type: DataTypes.TIME,
    allowNull: false
  },
  estimatedParticipants: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  remarks: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: true
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Approved', 'Rejected', 'Completed'),
    defaultValue: 'Pending'
  }
}, {
  tableName: 'camps'
});

module.exports = Camp;

