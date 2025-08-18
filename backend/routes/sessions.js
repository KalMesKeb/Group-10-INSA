import express from 'express';
import { body, validationResult } from 'express-validator';
import Session from '../models/Session.js';
import User from '../models/User.js';
import { authenticateSession } from '../middleware/session.js';

const router = express.Router();

// Create a new session booking
router.post('/book', authenticateSession, [
  body('tutorId').isMongoId().withMessage('Valid tutor ID is required'),
  body('subject').trim().isLength({ min: 1 }).withMessage('Subject is required'),
  body('title').trim().isLength({ min: 1, max: 200 }).withMessage('Title is required'),
  body('scheduledDate').isISO8601().withMessage('Valid scheduled date is required'),
  body('duration').isInt({ min: 15, max: 480 }).withMessage('Duration must be between 15 and 480 minutes')
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

    const { tutorId, subject, title, description, scheduledDate, duration, meetingType } = req.body;

    // Verify tutor exists and is approved
    const tutor = await User.findOne({
      _id: tutorId,
      role: 'tutor',
      'tutorProfile.isApproved': true
    });

    if (!tutor) {
      return res.status(404).json({
        success: false,
        message: 'Tutor not found or not approved'
      });
    }

    // Calculate pricing
    const hourlyRate = tutor.tutorProfile.pricing.hourlyRate;
    const totalAmount = (hourlyRate * duration) / 60;

    const session = new Session({
      studentId: req.user.id,
      tutorId,
      subject,
      title,
      description,
      scheduledDate: new Date(scheduledDate),
      duration,
      meetingType: meetingType || 'video_call',
      pricing: {
        hourlyRate,
        totalAmount,
        currency: 'ETB'
      }
    });

    await session.save();

    const populatedSession = await Session.findById(session._id)
      .populate('studentId', 'username email')
      .populate('tutorId', 'username email tutorProfile.subjects');

    res.status(201).json({
      success: true,
      message: 'Session booked successfully',
      session: populatedSession
    });
  } catch (error) {
    console.error('Book session error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while booking session'
    });
  }
});

// Get user's sessions
router.get('/my', authenticateSession, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = {};
    
    if (req.user.role === 'student') {
      query.studentId = req.user.id;
    } else if (req.user.role === 'tutor') {
      query.tutorId = req.user.id;
    }

    if (status) {
      query.status = status;
    }

    const sessions = await Session.find(query)
      .populate('studentId', 'username email')
      .populate('tutorId', 'username email tutorProfile.subjects')
      .sort({ scheduledDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Session.countDocuments(query);

    res.json({
      success: true,
      sessions,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching sessions'
    });
  }
});

// Update session
router.put('/:id', authenticateSession, async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    // Check if user is authorized to update
    const isAuthorized = session.studentId.toString() === req.user.id || 
                        session.tutorId.toString() === req.user.id;

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this session'
      });
    }

    const { scheduledDate, duration, description, status } = req.body;
    const updates = {};

    if (scheduledDate) {
      // Add to reschedule history
      session.rescheduleHistory.push({
        oldDate: session.scheduledDate,
        newDate: new Date(scheduledDate),
        reason: req.body.rescheduleReason || 'Rescheduled by user',
        requestedBy: req.user.id
      });
      updates.scheduledDate = new Date(scheduledDate);
    }

    if (duration) updates.duration = duration;
    if (description) updates.description = description;
    if (status) updates.status = status;

    Object.assign(session, updates);
    await session.save();

    const updatedSession = await Session.findById(session._id)
      .populate('studentId', 'username email')
      .populate('tutorId', 'username email tutorProfile.subjects');

    res.json({
      success: true,
      message: 'Session updated successfully',
      session: updatedSession
    });
  } catch (error) {
    console.error('Update session error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating session'
    });
  }
});

// Cancel session
router.post('/:id/cancel', authenticateSession, [
  body('reason').trim().isLength({ min: 5 }).withMessage('Cancellation reason is required')
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

    const session = await Session.findById(req.params.id);
    
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    const isAuthorized = session.studentId.toString() === req.user.id || 
                        session.tutorId.toString() === req.user.id;

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this session'
      });
    }

    session.status = 'cancelled';
    session.cancelledAt = new Date();
    session.cancelledBy = req.user.id;
    session.cancellationReason = req.body.reason;

    await session.save();

    res.json({
      success: true,
      message: 'Session cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel session error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while cancelling session'
    });
  }
});

// Add feedback to session
router.post('/:id/feedback', authenticateSession, [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().isLength({ max: 500 }).withMessage('Comment cannot exceed 500 characters')
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

    const session = await Session.findById(req.params.id);
    
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    const { rating, comment } = req.body;

    if (session.studentId.toString() === req.user.id) {
      session.feedback.studentRating = rating;
      session.feedback.studentComment = comment;
    } else if (session.tutorId.toString() === req.user.id) {
      session.feedback.tutorRating = rating;
      session.feedback.tutorComment = comment;
    } else {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to provide feedback for this session'
      });
    }

    await session.save();

    // Update tutor's overall rating if student provided feedback
    if (session.studentId.toString() === req.user.id) {
      const tutor = await User.findById(session.tutorId);
      const allSessions = await Session.find({
        tutorId: session.tutorId,
        'feedback.studentRating': { $exists: true }
      });

      const totalRating = allSessions.reduce((sum, s) => sum + s.feedback.studentRating, 0);
      const averageRating = totalRating / allSessions.length;

      tutor.tutorProfile.rating = Math.round(averageRating * 10) / 10;
      tutor.tutorProfile.totalSessions = allSessions.length;
      await tutor.save();
    }

    res.json({
      success: true,
      message: 'Feedback added successfully'
    });
  } catch (error) {
    console.error('Add feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding feedback'
    });
  }
});

export default router;
