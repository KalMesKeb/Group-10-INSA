import express from 'express';
import { body, validationResult } from 'express-validator';
import Contact from '../models/Contact.js';
import { authenticateSession, authorizeRoles } from '../middleware/session.js';

// @route   POST /api/contact
// @desc    Submit contact form
// @access  Public
const router = express.Router();
router.post('/', [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('message').trim().isLength({ min: 10, max: 1000 }).withMessage('Message must be between 10 and 1000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { name, email, message } = req.body;

    // Create new contact submission
    const contact = new Contact({
      name,
      email,
      message,
      submittedAt: new Date(),
      status: 'new'
    });

    await contact.save();

    // In a real application, you might want to:
    // 1. Send an email notification to admins
    // 2. Send a confirmation email to the user
    // 3. Add to a queue for processing

    res.status(201).json({
      success: true,
      message: 'Thank you for contacting us! We will get back to you soon.',
      data: {
        id: contact._id,
        submittedAt: contact.submittedAt
      }
    });

  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while submitting contact form'
    });
  }
});

// @route   GET /api/contact
// @desc    Get all contact submissions (Admin only)
// @access  Private (Admin only)
router.get('/', authenticateSession, authorizeRoles('admin'), async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    let query = {};
    if (status) {
      query.status = status;
    }

    const contacts = await Contact.find(query)
      .sort({ submittedAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    const total = await Contact.countDocuments(query);
    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      data: contacts,
      pagination: {
        current: pageNum,
        pages: totalPages,
        total,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1
      }
    });

  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching contacts'
    });
  }
});

// @route   PUT /api/contact/:id/status
// @desc    Update contact status (Admin only)
// @access  Private (Admin only)
router.put('/:id/status', authenticateSession, authorizeRoles('admin'), [
  body('status').isIn(['new', 'in_progress', 'resolved', 'closed']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { status } = req.body;

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact submission not found'
      });
    }

    res.json({
      success: true,
      message: 'Contact status updated successfully',
      data: contact
    });

  } catch (error) {
    console.error('Error updating contact status:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating contact status'
    });
  }
});

export default router;
