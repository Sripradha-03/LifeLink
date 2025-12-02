const Donor = require('./Donor');
const BloodRequest = require('./BloodRequest');
const BloodStock = require('./BloodStock');
const BloodCenter = require('./BloodCenter');
const Camp = require('./Camp');

// Define relationships
BloodRequest.belongsTo(Donor, { foreignKey: 'donorId', as: 'donor' });
Donor.hasMany(BloodRequest, { foreignKey: 'donorId', as: 'requests' });

BloodStock.belongsTo(BloodCenter, { foreignKey: 'bloodCenterId', as: 'bloodCenter' });
BloodCenter.hasMany(BloodStock, { foreignKey: 'bloodCenterId', as: 'stocks' });

module.exports = {
  Donor,
  BloodRequest,
  BloodStock,
  BloodCenter,
  Camp
};

