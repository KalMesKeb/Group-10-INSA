import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
    trim: true
  },
  name: {
    type: String,
    required: [true, 'Room name is required'],
    trim: true,
    maxlength: [100, 'Room name cannot exceed 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters'],
    default: ''
  },
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    role: {
      type: String,
      enum: ['host', 'participant'],
      default: 'participant'
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  maxParticipants: {
    type: Number,
    default: 10,
    min: 2,
    max: 50
  },
  settings: {
    allowChat: {
      type: Boolean,
      default: true
    },
    allowScreenShare: {
      type: Boolean,
      default: true
    },
    requirePassword: {
      type: Boolean,
      default: false
    },
    password: {
      type: String,
      default: null
    }
  },
  chatHistory: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: String,
    message: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Generate unique room ID
roomSchema.pre('save', function(next) {
  if (!this.roomId) {
    this.roomId = Math.random().toString(36).substr(2, 9);
  }
  next();
});

// Create unique index for roomId
roomSchema.index({ roomId: 1 }, { unique: true });

export default mongoose.model('Room', roomSchema);
