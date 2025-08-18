import express from 'express';
import User from '../models/User.js';
import TutorApplication from '../models/TutorApplication.js';
import Session from '../models/Session.js';
import Dispute from '../models/Dispute.js';
import { authenticateSession, authorizeRoles } from '../middleware/session.js';

const router = express.Router();

// Get dashboard statistics
router.get('/dashboard/stats', authenticateSession, authorizeRoles('admin'), async (req, res) => {
  try {
    const [
      totalUsers,
      totalTutors,
      totalStudents,
      pendingApplications,
      totalSessions,
      activeSessions,
      openDisputes,
      resolvedDisputes
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'tutor' }),
      User.countDocuments({ role: 'student' }),
      TutorApplication.countDocuments({ status: 'pending' }),
      Session.countDocuments(),
      Session.countDocuments({ status: { $in: ['scheduled', 'confirmed', 'in_progress'] } }),
      Dispute.countDocuments({ status: { $in: ['open', 'under_review'] } }),
      Dispute.countDocuments({ status: 'resolved' })
    ]);

    // Get recent activities
    const recentApplications = await TutorApplication.find()
      .populate('applicantId', 'username email')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentSessions = await Session.find()
      .populate('studentId', 'username')
      .populate('tutorId', 'username')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentDisputes = await Dispute.find()
      .populate('reporterId', 'username')
      .populate('reportedUserId', 'username')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      stats: {
        users: {
          total: totalUsers,
          tutors: totalTutors,
          students: totalStudents
        },
        applications: {
          pending: pendingApplications
        },
        sessions: {
          total: totalSessions,
          active: activeSessions
        },
        disputes: {
          open: openDisputes,
          resolved: resolvedDisputes
        }
      },
      recentActivity: {
        applications: recentApplications,
        sessions: recentSessions,
        disputes: recentDisputes
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching dashboard statistics'
    });
  }
});

// Get all users with filters
router.get('/users', authenticateSession, authorizeRoles('admin'), async (req, res) => {
  try {
    const { role, status, page = 1, limit = 10, search } = req.query;
    const query = {};

    if (role) query.role = role;
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      users,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching users'
    });
  }
});

// Suspend/Unsuspend user
router.patch('/users/:id/status', authenticateSession, authorizeRoles('admin'), async (req, res) => {
  try {
    const { status, reason } = req.body;
    
    if (!['active', 'suspended'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be "active" or "suspended"'
      });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Don't allow suspending other admins
    if (user.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Cannot suspend admin users'
      });
    }

    user.status = status;
    if (status === 'suspended') {
      user.suspendedAt = new Date();
      user.suspensionReason = reason;
      user.isOnline = false;
    } else {
      user.suspendedAt = undefined;
      user.suspensionReason = undefined;
    }

    await user.save();

    res.json({
      success: true,
      message: `User ${status === 'suspended' ? 'suspended' : 'unsuspended'} successfully`,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        status: user.status
      }
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating user status'
    });
  }
});

// Get all sessions for admin
router.get('/sessions', authenticateSession, authorizeRoles('admin'), async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = {};

    if (status) query.status = status;

    const sessions = await Session.find(query)
      .populate('studentId', 'username email')
      .populate('tutorId', 'username email')
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
    console.error('Get admin sessions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching sessions'
    });
  }
});

// Get approved tutors
router.get('/tutors', authenticateSession, authorizeRoles('admin'), async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const query = { 
      role: 'tutor',
      'tutorProfile.isApproved': true 
    };

    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { 'tutorProfile.subjects': { $regex: search, $options: 'i' } }
      ];
    }

    const tutors = await User.find(query)
      .select('-password')
      .sort({ 'tutorProfile.rating': -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      tutors,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get tutors error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching tutors'
    });
  }
});

export default router;
