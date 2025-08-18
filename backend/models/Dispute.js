import mongoose from 'mongoose';

const disputeSchema = new mongoose.Schema({
  reporterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reportedUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session'
  },
  category: {
    type: String,
    enum: [
      'payment_issue',
      'no_show',
      'inappropriate_behavior',
      'quality_concern',
      'technical_issue',
      'other'
    ],
    required: true
  },
  title: {
    type: String,
    required: [true, 'Dispute title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Dispute description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  evidence: [{
    type: String, // URLs to uploaded files/screenshots
    description: String
  }],
  status: {
    type: String,
    enum: ['open', 'under_review', 'resolved', 'closed'],
    default: 'open'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  resolution: {
    action: {
      type: String,
      enum: [
        'warning_issued',
        'refund_processed',
        'account_suspended',
        'no_action',
        'mediation_scheduled',
        'other'
      ]
    },
    description: String,
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    resolvedAt: Date
  },
  adminNotes: [{
    note: String,
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  communications: [{
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    message: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    isAdminMessage: {
      type: Boolean,
      default: false
    }
  }]
}, {
  timestamps: true
});

// Indexes for efficient queries
disputeSchema.index({ status: 1, priority: -1, createdAt: -1 });
disputeSchema.index({ reporterId: 1 });
disputeSchema.index({ reportedUserId: 1 });

export default mongoose.model('Dispute', disputeSchema);
