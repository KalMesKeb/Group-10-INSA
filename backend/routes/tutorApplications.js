import express from 'express';
import { body, validationResult } from 'express-validator';
import TutorApplication from '../models/TutorApplication.js';
import User from '../models/User.js';
import { authenticateSession, authorizeRoles } from '../middleware/session.js';

const router = express.Router();

// Submit tutor application
router.post('/submit', authenticateSession, [
  body('personalDetails.name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('personalDetails.email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('personalDetails.phone')
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  body('subjects')
    .isArray({ min: 1 })
    .withMessage('At least one subject is required'),
  body('pricing.hourlyRate')
    .isNumeric()
    .isFloat({ min: 0 })
    .withMessage('Hourly rate must be a positive number'),
  body('bio')
    .trim()
    .isLength({ min: 50, max: 1000 })
    .withMessage('Bio must be between 50 and 1000 characters')
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

    // Check if user already has a pending application
    const existingApplication = await TutorApplication.findOne({
      applicantId: req.userId,
      status: 'pending'
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You already have a pending application'
      });
    }

    const {
      personalDetails,
      credentials,
      subjects,
      pricing,
      availability,
      bio,
      profilePicture,
      demoVideo
    } = req.body;

    const application = new TutorApplication({
      applicantId: req.userId,
      personalDetails,
      credentials,
      subjects,
      pricing,
      availability,
      bio,
      profilePicture,
      demoVideo
    });

    await application.save();

    res.status(201).json({
      success: true,
      message: 'Tutor application submitted successfully',
      application: {
        id: application._id,
        status: application.status,
        submittedAt: application.createdAt
      }
    });
  } catch (error) {
    console.error('Submit application error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while submitting application'
    });
  }
});

// Get all applications (admin only)
router.get('/all', authenticateSession, authorizeRoles('admin'), async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = status ? { status } : {};

    const applications = await TutorApplication.find(query)
      .populate('applicantId', 'username email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await TutorApplication.countDocuments(query);

    res.json({
      success: true,
      applications,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching applications'
    });
  }
});

// Get application by ID
router.get('/:id', authenticateSession, async (req, res) => {
  try {
    const application = await TutorApplication.findById(req.params.id)
      .populate('applicantId', 'username email')
      .populate('reviewedBy', 'username');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Only admin or the applicant can view the application
    if (req.user.role !== 'admin' && application.applicantId._id.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      application
    });
  } catch (error) {
    console.error('Get application error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching application'
    });
  }
});

// Approve application (admin only)
router.post('/:id/approve', authenticateSession, authorizeRoles('admin'), async (req, res) => {
  try {
    const { adminNotes } = req.body;
    
    const application = await TutorApplication.findById(req.params.id)
      .populate('applicantId');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    if (application.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Application has already been processed'
      });
    }

    // Update application status
    application.status = 'approved';
    application.adminNotes = adminNotes || '';
    application.reviewedBy = req.userId;
    application.reviewedAt = new Date();
    await application.save();

    // Update user to tutor role and add tutor profile
    const user = await User.findById(application.applicantId._id);
    user.role = 'tutor';
    user.tutorProfile = {
      subjects: application.subjects,
      bio: application.bio,
      education: application.credentials.education,
      workExperience: application.credentials.workExperience,
      pricing: {
        hourlyRate: application.pricing.hourlyRate,
        packages: application.pricing.packages || []
      },
      availability: application.availability,
      profilePicture: application.profilePicture,
      demoVideo: application.demoVideo,
      isApproved: true,
      location: 'Ethiopia' // Default location
    };
    await user.save();

    res.json({
      success: true,
      message: 'Application approved successfully',
      application
    });
  } catch (error) {
    console.error('Approve application error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while approving application'
    });
  }
});

// Reject application (admin only)
router.post('/:id/reject', authenticateSession, authorizeRoles('admin'), [
  body('adminNotes')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Rejection reason must be at least 10 characters long')
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

    const { adminNotes } = req.body;
    
    const application = await TutorApplication.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    if (application.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Application has already been processed'
      });
    }

    application.status = 'rejected';
    application.adminNotes = adminNotes;
    application.reviewedBy = req.userId;
    application.reviewedAt = new Date();
    await application.save();

    res.json({
      success: true,
      message: 'Application rejected',
      application
    });
  } catch (error) {
    console.error('Reject application error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while rejecting application'
    });
  }
});

// Get user's own application status
router.get('/my/status', authenticateSession, async (req, res) => {
  try {
    const application = await TutorApplication.findOne({
      applicantId: req.user.id
    }).sort({ createdAt: -1 });

    if (!application) {
      return res.json({
        success: true,
        hasApplication: false,
        message: 'No application found'
      });
    }

    res.json({
      success: true,
      hasApplication: true,
      application: {
        id: application._id,
        status: application.status,
        submittedAt: application.createdAt,
        reviewedAt: application.reviewedAt,
        adminNotes: application.adminNotes
      }
    });
  } catch (error) {
    console.error('Get application status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching application status'
    });
  }
});

export default router;
