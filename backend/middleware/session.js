// Session-based authentication middleware
import User from '../models/User.js';
import Tutor from '../models/Tutor.js';
import Admin from '../models/Admin.js';

// Authentication middleware for session-based auth
export const authenticateSession = async (req, res, next) => {
  try {
    // Check if user is logged in via session
    if (!req.session.userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Get user from database across all collections
    let user = await User.findById(req.session.userId).select('isActive');
    let userRole = 'student';
    
    if (!user) {
      user = await Tutor.findById(req.session.userId).select('isActive');
      userRole = 'tutor';
    }
    if (!user) {
      user = await Admin.findById(req.session.userId).select('isActive');
      userRole = 'admin';
    }
    
    if (!user) {
      // User no longer exists, destroy session
      req.session.destroy();
      return res.status(401).json({
        success: false,
        message: 'User account not found'
      });
    }

    if (!user.isActive) {
      // User account is deactivated, destroy session
      req.session.destroy();
      return res.status(401).json({
        success: false,
        message: 'Account has been deactivated'
      });
    }

    // Attach user info to request object
    req.user = {
      id: user._id,
      role: userRole
    };

    next();
  } catch (error) {
    console.error('Session authentication error:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication error'
    });
  }
};

// Authorization middleware for role-based access
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.'
      });
    }

    next();
  };
};

// Rate limiting for authentication endpoints
import rateLimit from 'express-rate-limit';

export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export default { authenticateSession, authorizeRoles, authRateLimit };
