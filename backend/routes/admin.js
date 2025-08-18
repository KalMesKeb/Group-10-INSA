const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');
const Dispute = require('../models/Dispute');
const router = express.Router();

router.get('/stats', authMiddleware(['admin']), async (req, res) => {
  const users = await User.countDocuments();
  const tutors = await User.countDocuments({ role: 'tutor' });
  const disputes = await Dispute.countDocuments();
  res.json({ users, tutors, disputes });
});

module.exports = router;
