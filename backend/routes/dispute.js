const express = require('express');
const Dispute = require('../models/Dispute');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/submit', authMiddleware(['student', 'tutor']), async (req, res) => {
  const dispute = new Dispute({ ...req.body, createdBy: req.user.id });
  await dispute.save();
  res.json({ message: 'Dispute submitted' });
});

module.exports = router;
