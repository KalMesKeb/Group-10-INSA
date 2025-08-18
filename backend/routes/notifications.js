import express from 'express';
import Notification from '../models/Notification.js';
import { authenticateSession, authorizeRoles } from '../middleware/session.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// @route   GET /api/notifications
// @desc    Get user notifications
// @access  Private
router.get('/', authenticateSession, async (req, res) => {
  try {
    const { page = 1, limit = 20, unreadOnly = false } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    let query = { recipient: req.user.id };
    if (unreadOnly === 'true') {
      query.isRead = false;
    }

    const notifications = await Notification.find(query)
      .populate('sender', 'name profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({
      recipient: req.user.id,
      isRead: false
    });

    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      data: notifications,
      unreadCount,
      pagination: {
        current: pageNum,
        pages: totalPages,
        total,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1
      }
    });

  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching notifications'
    });
  }
});

// @route   PUT /api/notifications/:id/read
// @desc    Mark notification as read
// @access  Private
router.put('/:id/read', authenticateSession, async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      recipient: req.user.id
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    if (!notification.isRead) {
      await notification.markAsRead();
    }

    res.json({
      success: true,
      message: 'Notification marked as read'
    });

  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while marking notification as read'
    });
  }
});

// @route   PUT /api/notifications/read-all
// @desc    Mark all notifications as read
// @access  Private
router.put('/read-all', authenticateSession, async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user.id, isRead: false },
      { isRead: true, readAt: new Date() }
    );

    res.json({
      success: true,
      message: 'All notifications marked as read'
    });

  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while marking notifications as read'
    });
  }
});

// @route   DELETE /api/notifications/:id
// @desc    Delete notification
// @access  Private
router.delete('/:id', authenticateSession, async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      recipient: req.user.id
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.json({
      success: true,
      message: 'Notification deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting notification'
    });
  }
});

// @route   POST /api/notifications/send
// @desc    Send notification (Admin only)
// @access  Private (Admin only)
router.post('/send', 
  authenticateSession,
  authorizeRoles('admin'),
  [
    body('recipient').isMongoId().withMessage('Valid recipient ID is required'),
    body('type').isIn([
      'session_booked', 'session_cancelled', 'session_rescheduled', 'session_reminder',
      'dispute_created', 'dispute_resolved', 'tutor_application_approved', 
      'tutor_application_rejected', 'new_review', 'message', 'system'
    ]).withMessage('Invalid notification type'),
    body('title').isLength({ min: 1, max: 100 }).withMessage('Title must be between 1 and 100 characters'),
    body('message').isLength({ min: 1, max: 500 }).withMessage('Message must be between 1 and 500 characters')
  ],
  async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { recipient, type, title, message, data, priority = 'medium' } = req.body;

    const notification = new Notification({
      recipient,
      sender: req.user.id,
      type,
      title,
      message,
      data,
      priority
    });

    await notification.save();

    res.status(201).json({
      success: true,
      message: 'Notification sent successfully',
      data: notification
    });

  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while sending notification'
    });
  }
});

export default router;
