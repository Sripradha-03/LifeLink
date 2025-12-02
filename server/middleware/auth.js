const jwt = require('jsonwebtoken');
const Donor = require('../models/Donor');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const donor = await Donor.findByPk(decoded.id);

    if (!donor) {
      return res.status(401).json({ message: 'Token is not valid' });
    }

    req.user = donor;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

const adminAuth = async (req, res, next) => {
  // Simple admin check - you can enhance this later
  const isAdmin = req.header('X-Admin-Key') === process.env.ADMIN_SECRET;
  
  if (!isAdmin) {
    return res.status(403).json({ message: 'Admin access required' });
  }
  
  next();
};

module.exports = { auth, adminAuth };

