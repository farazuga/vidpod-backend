const express = require('express');
const router = express.Router();
const User = require('../models/User');

const requireAuth = (req, res, next) => {
  if (!req.session?.user) return res.status(401).json({ message: 'Authentication required' });
  next();
};

router.get('/', requireAuth, async (req, res) => {
  try {
    const users = await User.find({ isDeleted: false }).select('-password').limit(20);
    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
