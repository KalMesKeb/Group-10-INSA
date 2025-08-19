import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const tutorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function(email) {
        return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);
      },
      message: 'Please enter a valid email'
    }
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  role: {
    type: String,
    default: 'tutor',
    enum: ['tutor']
  },
  phone: String,
  age: Number,
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer_not_to_say']
  },
  profilePicture: String,
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: Date,
  lastLogin: Date,
  isOnline: {
    type: Boolean,
    default: false
  },
  lastSeen: {
    type: Date,
    default: Date.now
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  joinedRooms: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room'
  }],
  // Tutor-specific fields
  subjects: [{
    type: String,
    trim: true
  }],
  bio: {
    type: String,
    maxlength: [1000, 'Bio cannot exceed 1000 characters']
  },
  education: [{
    degree: String,
    institution: String,
    year: Number
  }],
  workExperience: [{
    role: String,
    company: String,
    duration: String,
    description: String
  }],
  pricing: {
    hourlyRate: {
      type: Number,
      min: 0
    },
    packages: [{
      name: String,
      price: Number,
      sessions: Number,
      description: String
    }]
  },
  availability: {
    type: Map,
    of: String
  },
  rating: {
    type: Number,
    default: 5.0,
    min: 1,
    max: 5
  },
  totalSessions: {
    type: Number,
    default: 0
  },
  demoVideo: String,
  isApproved: {
    type: Boolean,
    default: false
  },
  location: String
}, {
  timestamps: true
});

// Hash password before saving
tutorSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
tutorSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
tutorSchema.methods.toJSON = function() {
  const tutorObject = this.toObject();
  delete tutorObject.password;
  return tutorObject;
};

export default mongoose.model('Tutor', tutorSchema);
