import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const verificationCodeSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  hashedCode: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['email_verification', 'password_reset'],
    default: 'email_verification'
  },
  expiresAt: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
  },
  used: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for automatic cleanup of expired codes
verificationCodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Method to hash verification code
verificationCodeSchema.statics.hashCode = async function(code) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(code, salt);
};

// Method to verify code
verificationCodeSchema.methods.verifyCode = async function(code) {
  return await bcrypt.compare(code, this.hashedCode);
};

const VerificationCode = mongoose.model('VerificationCode', verificationCodeSchema);

export default VerificationCode;
