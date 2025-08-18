const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  roomId: { type: String, required: true },
  tutorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startedAt: { type: Date, default: Date.now },
  endedAt: { type: Date }, // Set when the session ends
  status: {
    type: String,
    enum: ['active', 'ended'],
    default: 'active'
  }
});

module.exports = mongoose.model('Session', sessionSchema);
