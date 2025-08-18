import express from 'express';
import { body, validationResult } from 'express-validator';
import Dispute from '../models/Dispute.js';
import Session from '../models/Session.js';
import { authenticateSession, authorizeRoles } from '../middleware/session.js';

const router = express.Router();

// Create a new dispute
router.post('/create', authenticateSession, [
  body('reportedUserId').isMongoId().withMessage('Valid reported user ID is required'),
  body('category').isIn([
    'payment_issue', 'no_show', 'inappropriate_behavior', 
    'quality_concern', 'technical_issue', 'other'
  ]).withMessage('Valid category is required'),
  body('title').trim().isLength({ min: 5, max: 200 }).withMessage('Title must be between 5 and 200 characters'),
  body('description').trim().isLength({ min: 20, max: 2000 }).withMessage('Description must be between 20 and 2000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { reportedUserId, sessionId, category, title, description, evidence, priority } = req.body;

    // Verify session exists if provided
    if (sessionId) {
      const session = await Session.findById(sessionId);
      if (!session) {
        return res.status(404).json({
          success: false,
          message: 'Session not found'
        });
      }

      // Verify user is part of the session
      const isParticipant = session.studentId.toString() === req.user.id || 
                           session.tutorId.toString() === req.user.id;
      
      if (!isParticipant) {
        return res.status(403).json({
          success: false,
          message: 'You can only report disputes for sessions you participated in'
        });
      }
    }

    const dispute = new Dispute({
      reporterId: req.user.id,
      reportedUserId,
      sessionId: sessionId || undefined,
      category,
      title,
      description,
      evidence: evidence || [],
      priority: priority || 'medium'
    });

    await dispute.save();

    const populatedDispute = await Dispute.findById(dispute._id)
      .populate('reporterId', 'username email')
      .populate('reportedUserId', 'username email')
      .populate('sessionId', 'title scheduledDate');

    res.status(201).json({
      success: true,
      message: 'Dispute created successfully',
      dispute: populatedDispute
    });
  } catch (error) {
    console.error('Create dispute error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating dispute'
    });
  }
});

// Get all disputes (admin only)
router.get('/all', authenticateSession, authorizeRoles('admin'), async (req, res) => {
  try {
    const { status, priority, category, page = 1, limit = 10 } = req.query;
    const query = {};

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (category) query.category = category;

    const disputes = await Dispute.find(query)
      .populate('reporterId', 'username email')
      .populate('reportedUserId', 'username email')
      .populate('sessionId', 'title scheduledDate')
      .populate('resolution.resolvedBy', 'username')
      .sort({ priority: -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Dispute.countDocuments(query);

    res.json({
      success: true,
      disputes,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get disputes error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching disputes'
    });
  }
});

// Get user's disputes
router.get('/my', authenticateSession, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const disputes = await Dispute.find({
      $or: [
        { reporterId: req.user.id },
        { reportedUserId: req.user.id }
      ]
    })
      .populate('reporterId', 'username email')
      .populate('reportedUserId', 'username email')
      .populate('sessionId', 'title scheduledDate')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Dispute.countDocuments({
      $or: [
        { reporterId: req.user.id },
        { reportedUserId: req.user.id }
      ]
    });

    res.json({
      success: true,
      disputes,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get user disputes error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching disputes'
    });
  }
});

// Get dispute by ID
router.get('/:id', authenticateSession, async (req, res) => {
  try {
    const dispute = await Dispute.findById(req.params.id)
      .populate('reporterId', 'username email')
      .populate('reportedUserId', 'username email')
      .populate('sessionId', 'title scheduledDate')
      .populate('resolution.resolvedBy', 'username')
      .populate('adminNotes.addedBy', 'username')
      .populate('communications.from', 'username');

    if (!dispute) {
      return res.status(404).json({
        success: false,
        message: 'Dispute not found'
      });
    }

    // Check authorization
    const isAuthorized = req.user.role === 'admin' ||
                        dispute.reporterId._id.toString() === req.user.id ||
                        dispute.reportedUserId._id.toString() === req.user.id;

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      dispute
    });
  } catch (error) {
    console.error('Get dispute error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching dispute'
    });
  }
});

// Resolve dispute (admin only)
router.post('/:id/resolve', authenticateSession, authorizeRoles('admin'), [
  body('action').isIn([
    'warning_issued', 'refund_processed', 'account_suspended',
    'no_action', 'mediation_scheduled', 'other'
  ]).withMessage('Valid resolution action is required'),
  body('description').trim().isLength({ min: 10 }).withMessage('Resolution description is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const dispute = await Dispute.findById(req.params.id);
    
    if (!dispute) {
      return res.status(404).json({
        success: false,
        message: 'Dispute not found'
      });
    }

    const { action, description } = req.body;

    dispute.status = 'resolved';
    dispute.resolution = {
      action,
      description,
      resolvedBy: req.user.id,
      resolvedAt: new Date()
    };

    await dispute.save();

    const resolvedDispute = await Dispute.findById(dispute._id)
      .populate('reporterId', 'username email')
      .populate('reportedUserId', 'username email')
      .populate('resolution.resolvedBy', 'username');

    res.json({
      success: true,
      message: 'Dispute resolved successfully',
      dispute: resolvedDispute
    });
  } catch (error) {
    console.error('Resolve dispute error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while resolving dispute'
    });
  }
});

// Add admin note to dispute
router.post('/:id/note', authenticateSession, authorizeRoles('admin'), [
  body('note').trim().isLength({ min: 5 }).withMessage('Note must be at least 5 characters long')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const dispute = await Dispute.findById(req.params.id);
    
    if (!dispute) {
      return res.status(404).json({
        success: false,
        message: 'Dispute not found'
      });
    }

    dispute.adminNotes.push({
      note: req.body.note,
      addedBy: req.user.id
    });

    await dispute.save();

    res.json({
      success: true,
      message: 'Admin note added successfully'
    });
  } catch (error) {
    console.error('Add admin note error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding admin note'
    });
  }
});

// Add communication to dispute
router.post('/:id/communicate', authenticateSession, [
  body('message').trim().isLength({ min: 5 }).withMessage('Message must be at least 5 characters long')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const dispute = await Dispute.findById(req.params.id);
    
    if (!dispute) {
      return res.status(404).json({
        success: false,
        message: 'Dispute not found'
      });
    }

    // Check authorization
    const isAuthorized = req.user.role === 'admin' ||
                        dispute.reporterId.toString() === req.user.id ||
                        dispute.reportedUserId.toString() === req.user.id;

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    dispute.communications.push({
      from: req.user.id,
      message: req.body.message,
      isAdminMessage: req.user.role === 'admin'
    });

    await dispute.save();

    res.json({
      success: true,
      message: 'Message added successfully'
    });
  } catch (error) {
    console.error('Add communication error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding communication'
    });
  }
});

export default router;
