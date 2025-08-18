import express from 'express';
import User from '../models/User.js';
import Session from '../models/Session.js';
import Dispute from '../models/Dispute.js';
import TutorApplication from '../models/TutorApplication.js';
import Contact from '../models/Contact.js';
import { auth, authorize } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/stats/admin
// @desc    Get admin dashboard statistics
// @access  Private (Admin only)
router.get('/admin', [auth, authorize(['admin'])], async (req, res) => {
  try {
    // Get date range for filtering (default to last 30 days)
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    // Parallel queries for better performance
    const [
      totalUsers,
      totalStudents,
      totalTutors,
      activeTutors,
      totalSessions,
      completedSessions,
      pendingApplications,
      approvedApplications,
      rejectedApplications,
      openDisputes,
      resolvedDisputes,
      newContacts,
      recentUsers,
      recentSessions,
      monthlyStats
    ] = await Promise.all([
      // User statistics
      User.countDocuments(),
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'tutor' }),
      User.countDocuments({ role: 'tutor', 'tutorProfile.isActive': true }),

      // Session statistics
      Session.countDocuments(),
      Session.countDocuments({ status: 'completed' }),

      // Application statistics
      TutorApplication.countDocuments({ status: 'pending' }),
      TutorApplication.countDocuments({ status: 'approved' }),
      TutorApplication.countDocuments({ status: 'rejected' }),

      // Dispute statistics
      Dispute.countDocuments({ status: { $in: ['open', 'in_progress'] } }),
      Dispute.countDocuments({ status: 'resolved' }),

      // Contact statistics
      Contact.countDocuments({ status: 'new', createdAt: { $gte: startDate } }),

      // Recent activity
      User.find().sort({ createdAt: -1 }).limit(5).select('name email role createdAt'),
      Session.find().populate('student tutor', 'name').sort({ createdAt: -1 }).limit(5),

      // Monthly statistics for charts
      User.aggregate([
        {
          $match: { createdAt: { $gte: startDate } }
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
              day: { $dayOfMonth: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
      ])
    ]);

    // Calculate revenue (assuming sessions have a price)
    const revenueStats = await Session.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$price' },
          averageSessionPrice: { $avg: '$price' }
        }
      }
    ]);

    // Top performing tutors
    const topTutors = await User.aggregate([
      { $match: { role: 'tutor', 'tutorProfile.isApproved': true } },
      {
        $lookup: {
          from: 'sessions',
          localField: '_id',
          foreignField: 'tutor',
          as: 'sessions'
        }
      },
      {
        $project: {
          name: 1,
          'tutorProfile.averageRating': 1,
          'tutorProfile.totalReviews': 1,
          sessionCount: { $size: '$sessions' },
          completedSessions: {
            $size: {
              $filter: {
                input: '$sessions',
                cond: { $eq: ['$$this.status', 'completed'] }
              }
            }
          }
        }
      },
      { $sort: { sessionCount: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalStudents,
          totalTutors,
          activeTutors,
          totalSessions,
          completedSessions,
          sessionCompletionRate: totalSessions > 0 ? ((completedSessions / totalSessions) * 100).toFixed(1) : 0
        },
        applications: {
          pending: pendingApplications,
          approved: approvedApplications,
          rejected: rejectedApplications,
          total: pendingApplications + approvedApplications + rejectedApplications
        },
        disputes: {
          open: openDisputes,
          resolved: resolvedDisputes,
          total: openDisputes + resolvedDisputes
        },
        contacts: {
          new: newContacts
        },
        revenue: {
          total: revenueStats[0]?.totalRevenue || 0,
          average: revenueStats[0]?.averageSessionPrice || 0
        },
        recentActivity: {
          users: recentUsers,
          sessions: recentSessions
        },
        charts: {
          userGrowth: monthlyStats
        },
        topTutors
      }
    });

  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching statistics'
    });
  }
});

// @route   GET /api/stats/tutor
// @desc    Get tutor dashboard statistics
// @access  Private (Tutor only)
router.get('/tutor', [auth, authorize(['tutor'])], async (req, res) => {
  try {
    const tutorId = req.user.id;
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const [
      totalSessions,
      completedSessions,
      cancelledSessions,
      upcomingSessions,
      totalEarnings,
      averageRating,
      totalReviews,
      recentSessions,
      monthlyEarnings
    ] = await Promise.all([
      Session.countDocuments({ tutor: tutorId }),
      Session.countDocuments({ tutor: tutorId, status: 'completed' }),
      Session.countDocuments({ tutor: tutorId, status: 'cancelled' }),
      Session.countDocuments({ 
        tutor: tutorId, 
        status: 'confirmed',
        scheduledDate: { $gte: new Date() }
      }),

      // Calculate total earnings
      Session.aggregate([
        { $match: { tutor: tutorId, status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$price' } } }
      ]),

      // Get tutor profile stats
      User.findById(tutorId).select('tutorProfile.averageRating tutorProfile.totalReviews'),

      // Get review count
      User.aggregate([
        { $match: { _id: tutorId } },
        { $project: { reviewCount: { $size: '$tutorProfile.reviews' } } }
      ]),

      // Recent sessions
      Session.find({ tutor: tutorId })
        .populate('student', 'name')
        .sort({ createdAt: -1 })
        .limit(5),

      // Monthly earnings for chart
      Session.aggregate([
        {
          $match: {
            tutor: tutorId,
            status: 'completed',
            createdAt: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            earnings: { $sum: '$price' },
            sessions: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
      ])
    ]);

    const tutorProfile = await User.findById(tutorId).select('tutorProfile');

    res.json({
      success: true,
      data: {
        overview: {
          totalSessions,
          completedSessions,
          cancelledSessions,
          upcomingSessions,
          completionRate: totalSessions > 0 ? ((completedSessions / totalSessions) * 100).toFixed(1) : 0
        },
        earnings: {
          total: totalEarnings[0]?.total || 0,
          thisMonth: monthlyEarnings[monthlyEarnings.length - 1]?.earnings || 0
        },
        rating: {
          average: tutorProfile?.tutorProfile?.averageRating || 0,
          totalReviews: tutorProfile?.tutorProfile?.totalReviews || 0
        },
        recentSessions,
        charts: {
          monthlyEarnings
        }
      }
    });

  } catch (error) {
    console.error('Error fetching tutor stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching statistics'
    });
  }
});

// @route   GET /api/stats/student
// @desc    Get student dashboard statistics
// @access  Private (Student only)
router.get('/student', [auth, authorize(['student'])], async (req, res) => {
  try {
    const studentId = req.user.id;
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const [
      totalSessions,
      completedSessions,
      cancelledSessions,
      upcomingSessions,
      totalSpent,
      favoriteTutors,
      recentSessions,
      monthlySpending
    ] = await Promise.all([
      Session.countDocuments({ student: studentId }),
      Session.countDocuments({ student: studentId, status: 'completed' }),
      Session.countDocuments({ student: studentId, status: 'cancelled' }),
      Session.countDocuments({ 
        student: studentId, 
        status: 'confirmed',
        scheduledDate: { $gte: new Date() }
      }),

      // Calculate total spending
      Session.aggregate([
        { $match: { student: studentId, status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$price' } } }
      ]),

      // Get favorite tutors (most booked)
      Session.aggregate([
        { $match: { student: studentId } },
        { $group: { _id: '$tutor', sessionCount: { $sum: 1 } } },
        { $sort: { sessionCount: -1 } },
        { $limit: 3 },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'tutor'
          }
        },
        { $unwind: '$tutor' },
        {
          $project: {
            name: '$tutor.name',
            sessionCount: 1,
            subjects: '$tutor.tutorProfile.subjects'
          }
        }
      ]),

      // Recent sessions
      Session.find({ student: studentId })
        .populate('tutor', 'name tutorProfile.subjects')
        .sort({ createdAt: -1 })
        .limit(5),

      // Monthly spending for chart
      Session.aggregate([
        {
          $match: {
            student: studentId,
            status: 'completed',
            createdAt: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            spent: { $sum: '$price' },
            sessions: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
      ])
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalSessions,
          completedSessions,
          cancelledSessions,
          upcomingSessions,
          completionRate: totalSessions > 0 ? ((completedSessions / totalSessions) * 100).toFixed(1) : 0
        },
        spending: {
          total: totalSpent[0]?.total || 0,
          thisMonth: monthlySpending[monthlySpending.length - 1]?.spent || 0
        },
        favoriteTutors,
        recentSessions,
        charts: {
          monthlySpending
        }
      }
    });

  } catch (error) {
    console.error('Error fetching student stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching statistics'
    });
  }
});

export default router;
