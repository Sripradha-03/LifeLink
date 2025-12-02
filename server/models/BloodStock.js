const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const BloodStock = sequelize.define('BloodStock', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  bloodCenterId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'blood_centers',
      key: 'id'
    }
  },
  bloodGroup: {
    type: DataTypes.ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'),
    allowNull: false
  },
  bloodComponent: {
    type: DataTypes.ENUM(
      'Whole Blood',
      'Single Donor Platelets',
      'Single Donor Plasma',
      'SAGM Packed Red Blood Cells',
      'Random Donor Platelets',
      'Platelet Concentrate',
      'Plasma',
      'Packed Red Blood Cells',
      'Leukoreduced RBC',
      'Irradiated RBC',
      'Fresh Frozen Plasma',
      'Cryoprecipitate',
      'Curo Poor Plasma'
    ),
    allowNull: false
  },
  unitsAvailable: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  expiryDate: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'blood_stocks'
});

module.exports = BloodStock;

