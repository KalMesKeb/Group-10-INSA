const mongoose = require('mongoose');

const tutorProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subjects: [String],
  bio: String,
  experience: String,
  availability: String
});

module.exports = mongoose.model('TutorProfile', tutorProfileSchema);
