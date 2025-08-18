import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tutor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true
  },
  title: {
    type: String,
    required: [true, 'Session title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  scheduledDate: {
    type: Date,
    required: [true, 'Scheduled date is required']
  },
  scheduledTime: {
    type: String,
    required: [true, 'Scheduled time is required']
  },
  duration: {
    type: Number, // Duration in minutes
    required: [true, 'Duration is required'],
    min: 15,
    max: 480 // Max 8 hours
  },
  status: {
    type: String,
    enum: [
      'scheduled',
      'confirmed',
      'in_progress',
      'completed',
      'cancelled',
      'no_show_student',
      'no_show_tutor'
    ],
    default: 'scheduled'
  },
  meetingType: {
    type: String,
    enum: ['video_call', 'in_person', 'phone_call'],
    default: 'video_call'
  },
  roomId: {
    type: String, // For live video sessions
    unique: true,
    sparse: true
  },
  pricing: {
    hourlyRate: {
      type: Number,
      required: true,
      min: 0
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0
    },
    currency: {
      type: String,
      default: 'ETB'
    }
  },
  payment: {
    status: {
      type: String,
      enum: ['pending', 'paid', 'refunded', 'disputed'],
      default: 'pending'
    },
    method: String,
    transactionId: String,
    paidAt: Date
  },
  feedback: {
    studentRating: {
      type: Number,
      min: 1,
      max: 5
    },
    studentComment: {
      type: String,
      maxlength: [500, 'Comment cannot exceed 500 characters']
    },
    tutorRating: {
      type: Number,
      min: 1,
      max: 5
    },
    tutorComment: {
      type: String,
      maxlength: [500, 'Comment cannot exceed 500 characters']
    }
  },
  materials: [{
    name: String,
    url: String,
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  notes: {
    studentNotes: String,
    tutorNotes: String,
    adminNotes: String
  },
  rescheduleHistory: [{
    oldDate: Date,
    newDate: Date,
    reason: String,
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    requestedAt: {
      type: Date,
      default: Date.now
    }
  }],
  cancelledAt: Date,
  cancelledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  cancellationReason: String
}, {
  timestamps: true
});

// Generate unique room ID for video sessions
sessionSchema.pre('save', function(next) {
  if (this.meetingType === 'video_call' && !this.roomId) {
    this.roomId = `session-${this._id}-${Math.random().toString(36).substr(2, 9)}`;
  }
  next();
});

export default mongoose.model('Session', sessionSchema);
