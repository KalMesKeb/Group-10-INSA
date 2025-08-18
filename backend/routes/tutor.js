const express = require('express');
const TutorProfile = require('../models/TutorProfile');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', authMiddleware(['tutor']), async (req, res) => {
  const profile = new TutorProfile({ ...req.body, userId: req.user.id });
  await profile.save();
  res.json(profile);
});

router.get('/my-profile', authMiddleware(['tutor']), async (req, res) => {
  const profile = await TutorProfile.findOne({ userId: req.user.id });
  res.json(profile);
});

router.get('/all', async (req, res) => {
  const tutors = await TutorProfile.find().populate('userId', 'name');
  res.json(tutors);
});

module.exports = router;
