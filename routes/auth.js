const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, isDeleted: false, status: 'active' });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    user.lastLogin = new Date();
    await user.save();

    req.session.user = { id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role };

    res.json({
      message: 'Login successful',
      user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during login' });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.json({ message: 'Logout successful' });
  });
});

router.get('/me', (req, res) => {
  if (!req.session?.user) return res.status(401).json({ message: 'Not authenticated' });
  User.findById(req.session.user.id).select('-password')
    .then(user => res.json({ user }))
    .catch(() => res.status(500).json({ message: 'Server error' }));
});

module.exports = router;
