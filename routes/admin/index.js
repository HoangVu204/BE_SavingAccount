const express = require('express');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const router = express.Router();

router.get('/admin/dashboard', authenticate, authorize('admin'), (req, res) => {
  res.status(200).json({ message: 'Welcome Admin!' });
});

router.get('/user/profile', authenticate, authorize('admin', 'user'), (req, res) => {
  res.status(200).json({ message: 'Welcome User!' });
});

module.exports = router;
