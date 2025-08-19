import express from 'express';
import User from '../models/User.js';
import Tutor from '../models/Tutor.js';
import TutorApplication from '../models/TutorApplication.js';
import { auth, authorize } from '../middleware/auth.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// @route   GET /api/tutors
// @desc    Get all approved tutors with search and filtering
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      search,
      subject,
      minPrice,
      maxPrice,
      rating,
      availability,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query for verified and approved tutors
    let query = { 
      isVerified: true,
      isApproved: true,
      isActive: true
    };

    // Search by name or subjects
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { subjects: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by specific subject
    if (subject) {
      query.subjects = { $regex: subject, $options: 'i' };
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query['pricing.hourlyRate'] = {};
      if (minPrice) query['pricing.hourlyRate'].$gte = parseFloat(minPrice);
      if (maxPrice) query['pricing.hourlyRate'].$lte = parseFloat(maxPrice);
    }

    // Filter by minimum rating
    if (rating) {
      query.rating = { $gte: parseFloat(rating) };
    }

    // Filter by availability
    if (availability) {
      query[`availability.${availability}`] = { $exists: true };
    }

    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query with pagination
    const tutors = await Tutor.find(query)
      .select('-password')
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    // Get total count for pagination
    const total = await Tutor.countDocuments(query);

    // Calculate pagination info
    const totalPages = Math.ceil(total / limitNum);
    const hasNextPage = pageNum < totalPages;
    const hasPrevPage = pageNum > 1;

    res.json({
      success: true,
      data: tutors,
      pagination: {
        current: pageNum,
        pages: totalPages,
        total,
        hasNext: hasNextPage,
        hasPrev: hasPrevPage
      }
    });

  } catch (error) {
    console.error('Error fetching tutors:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching tutors'
    });
  }
});

// @route   GET /api/tutors/:id
// @desc    Get tutor by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    // Validate ObjectId format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid tutor ID format'
      });
    }

    const tutor = await Tutor.findOne({
      _id: req.params.id,
      isVerified: true,
      isApproved: true
    }).select('-password');

    if (!tutor) {
      return res.status(404).json({
        success: false,
        message: 'Tutor not found'
      });
    }

    res.json({
      success: true,
      data: tutor
    });
  } catch (error) {
    console.error('Get tutor error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/tutors/subjects/list
// @desc    Get list of all available subjects
// @access  Public
router.get('/subjects/list', async (req, res) => {
  try {
    const subjects = await Tutor.aggregate([
      { $match: { isVerified: true, isApproved: true } },
      { $unwind: '$subjects' },
      { $group: { _id: '$subjects' } },
      { $sort: { _id: 1 } }
    ]);

    const subjectList = subjects.map(s => s._id);

    res.json({
      success: true,
      data: subjectList
    });

  } catch (error) {
    console.error('Error fetching subjects:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching subjects'
    });
  }
});

// @route   PUT /api/tutors/profile
// @desc    Update tutor profile
// @access  Private (Tutor only)
router.put('/profile', [
  auth,
  authorize(['tutor']),
  [
    body('bio').optional().isLength({ min: 10, max: 1000 }).withMessage('Bio must be between 10 and 1000 characters'),
    body('subjects').optional().isArray().withMessage('Subjects must be an array'),
    body('hourlyRate').optional().isNumeric().withMessage('Hourly rate must be a number'),
    body('availability').optional().isString().withMessage('Availability must be a string')
  ]
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

    const {
      bio,
      subjects,
      hourlyRate,
      availability,
      education,
      workExperience
    } = req.body;

    const updateData = {};
    if (bio) updateData['tutorProfile.bio'] = bio;
    if (subjects) updateData['tutorProfile.subjects'] = subjects;
    if (hourlyRate) updateData['tutorProfile.hourlyRate'] = hourlyRate;
    if (availability) updateData['tutorProfile.availability'] = availability;
    if (education) updateData['tutorProfile.education'] = education;
    if (workExperience) updateData['tutorProfile.workExperience'] = workExperience;

    const tutor = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password -__v');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: tutor
    });

  } catch (error) {
    console.error('Error updating tutor profile:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating profile'
    });
  }
});

// @route   POST /api/tutors/:id/review
// @desc    Add review for a tutor
// @access  Private (Student only)
router.post('/:id/review', [
  auth,
  authorize(['student']),
  [
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').isLength({ min: 10, max: 500 }).withMessage('Comment must be between 10 and 500 characters')
  ]
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

    const { rating, comment } = req.body;
    const tutorId = req.params.id;

    // Check if tutor exists
    const tutor = await User.findOne({
      _id: tutorId,
      role: 'tutor',
      'tutorProfile.isApproved': true
    });

    if (!tutor) {
      return res.status(404).json({
        success: false,
        message: 'Tutor not found'
      });
    }

    // Check if student already reviewed this tutor
    const existingReview = tutor.tutorProfile.reviews.find(
      review => review.student.toString() === req.user.id
    );

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this tutor'
      });
    }

    // Add new review
    const newReview = {
      student: req.user.id,
      studentName: req.user.name,
      rating,
      comment,
      createdAt: new Date()
    };

    tutor.tutorProfile.reviews.push(newReview);

    // Calculate new average rating
    const totalRating = tutor.tutorProfile.reviews.reduce((sum, review) => sum + review.rating, 0);
    tutor.tutorProfile.averageRating = totalRating / tutor.tutorProfile.reviews.length;
    tutor.tutorProfile.totalReviews = tutor.tutorProfile.reviews.length;

    await tutor.save();

    res.json({
      success: true,
      message: 'Review added successfully',
      data: newReview
    });

  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding review'
    });
  }
});

// @route   GET /api/tutors/:id/reviews
// @desc    Get reviews for a tutor
// @access  Public
router.get('/:id/reviews', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const tutor = await User.findOne({
      _id: req.params.id,
      role: 'tutor'
    }).select('tutorProfile.reviews tutorProfile.averageRating tutorProfile.totalReviews');

    if (!tutor) {
      return res.status(404).json({
        success: false,
        message: 'Tutor not found'
      });
    }

    const reviews = tutor.tutorProfile.reviews
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(skip, skip + limitNum);

    const total = tutor.tutorProfile.reviews.length;
    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      data: {
        reviews,
        averageRating: tutor.tutorProfile.averageRating,
        totalReviews: tutor.tutorProfile.totalReviews,
        pagination: {
          current: pageNum,
          pages: totalPages,
          total,
          hasNext: pageNum < totalPages,
          hasPrev: pageNum > 1
        }
      }
    });

  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching reviews'
    });
  }
});

export default router;
