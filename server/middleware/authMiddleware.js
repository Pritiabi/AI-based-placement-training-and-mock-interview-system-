const { verifyToken } = require('../config/firebase');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, token missing' });
  }

  try {
    const decoded = await verifyToken(token);
    let user = await User.findOne({ firebaseUid: decoded.uid });

    // Fallback: create profile if first API call after registration
    if (!user) {
      user = await User.create({
        firebaseUid: decoded.uid,
        email: decoded.email || 'user@placeprep.ai',
        name: decoded.name || 'Placement Aspirant',
        role: decoded.email === 'admin@placeprep.ai' ? 'admin' : 'user',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Not authorized token failed: ' + error.message });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Forbidden: Admin access required' });
  }
};

module.exports = { protect, adminOnly };
