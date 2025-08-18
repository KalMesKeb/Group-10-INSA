import mongoose from 'mongoose';

const tutorApplicationSchema = new mongoose.Schema({
  applicantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Personal Information
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^\+?[\d\s-()]+$/, 'Please provide a valid phone number']
  },
  age: {
    type: Number,
    min: [18, 'Must be at least 18 years old'],
    max: [100, 'Invalid age']
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer_not_to_say']
  },
  credentials: {
    education: [{
      degree: {
        type: String,
        required: true
      },
      institution: {
        type: String,
        required: true
      },
      year: Number,
      gpa: Number
    }],
    workExperience: [{
      role: String,
      company: String,
      duration: String,
      description: String
    }],
    certifications: [{
      name: String,
      issuer: String,
      year: Number
    }]
  },
  subjects: [{
    type: String,
    required: true,
    trim: true
  }],
  // Pricing Information
  pricing: {
    hourly: {
      type: Number,
      required: [true, 'Hourly rate is required'],
      min: [1, 'Hourly rate must be at least 1']
    },
    packages: [{
      name: String,
      sessions: Number,
      price: Number,
      description: String
    }]
  },
  availability: {
    type: Map,
    of: String
  },
  bio: {
    type: String,
    required: [true, 'Bio is required'],
    maxlength: [1000, 'Bio cannot exceed 1000 characters']
  },
  profilePicture: {
    type: String,
    default: null
  },
  demoVideo: {
    type: String,
    required: [true, 'Demo video is required']
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  adminNotes: {
    type: String,
    default: ''
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for efficient queries
tutorApplicationSchema.index({ status: 1, createdAt: -1 });
tutorApplicationSchema.index({ applicantId: 1 });

export default mongoose.model('TutorApplication', tutorApplicationSchema);
