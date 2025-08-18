import express from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import VerificationCode from '../models/VerificationCode.js';
import { authenticateSession, authorizeRoles, authRateLimit } from '../middleware/session.js';
import { sendVerificationEmail } from '../config/email.js';

const router = express.Router();

// Register user
router.post('/register', authRateLimit, [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('role')
    .isIn(['student', 'tutor', 'admin'])
    .withMessage('Role must be student, tutor, or admin')
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

    const { name, email, password, role, gradeLevel, subjects } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create user data
    const userData = { name, email, password, role };
    
    // Add role-specific data
    if (role === 'student' && gradeLevel) {
      userData.studentProfile = { gradeLevel };
    }
    if (role === 'tutor' && subjects) {
      userData.tutorProfile = { subjects: Array.isArray(subjects) ? subjects : [subjects] };
    }

    // Create new user (but not verified yet)
    const user = new User(userData);
    await user.save();

    // Generate 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Hash the verification code before storing
    const hashedCode = await VerificationCode.hashCode(verificationCode);
    
    // Clean up any existing verification codes for this email
    await VerificationCode.deleteMany({ email, type: 'email_verification' });
    
    // Store hashed verification code in separate table
    const verificationEntry = new VerificationCode({
      email,
      hashedCode,
      type: 'email_verification',
      expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    });
    await verificationEntry.save();

    // Send verification email
    const emailResult = await sendVerificationEmail(email, verificationCode, name);
    
    if (!emailResult.success) {
      console.error('Failed to send verification email:', emailResult.error);
    }

    res.status(201).json({
      success: true,
      message: 'User registered successfully. Please check your email to verify your account.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
});

// Email verification route (code-based)
router.post('/verify-email', [
  body('email').isEmail().withMessage('Valid email required'),
  body('code').isLength({ min: 6, max: 6 }).withMessage('6-digit code required')
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

    const { email, code } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User not found'
      });
    }

    // Find valid verification code
    const verificationEntry = await VerificationCode.findOne({
      email,
      type: 'email_verification',
      used: false,
      expiresAt: { $gt: new Date() }
    });

    if (!verificationEntry) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification code'
      });
    }

    // Verify the code
    const isValidCode = await verificationEntry.verifyCode(code);
    if (!isValidCode) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification code'
      });
    }

    // Mark user as verified
    user.emailVerified = true;
    await user.save();
    
    // Delete the verification code immediately after use
    await VerificationCode.deleteOne({ _id: verificationEntry._id });
    
    // Create session for the user
    req.session.userId = user._id;
    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      emailVerified: user.emailVerified
    };

    res.json({
      success: true,
      message: 'Email verified successfully! Redirecting to dashboard...',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified
      }
    });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during email verification'
    });
  }
});

// Get current user session
router.get('/me', authenticateSession, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified
      }
    });
  } catch (error) {
    console.error('Session check error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Login user
router.post('/login', authRateLimit, [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
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

    const { email, password } = req.body;

    // Check if user exists and password is correct
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if email is verified
    if (!user.emailVerified) {
      return res.status(401).json({
        success: false,
        message: 'Please verify your email before logging in. Check your inbox for the verification link.'
      });
    }

    // Update user status
    user.isOnline = true;
    user.lastSeen = new Date();
    user.lastLogin = new Date();
    await user.save();

    // Create session
    req.session.userId = user._id;
    req.session.userRole = user.role;
    req.session.loginTime = new Date();

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isOnline: user.isOnline
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// Logout user
router.post('/logout', authenticateSession, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user) {
      user.isOnline = false;
      user.lastSeen = new Date();
      await user.save();
    }

    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Could not log out'
        });
      }
      res.clearCookie('sessionId');
      res.json({
        success: true,
        message: 'Logged out successfully'
      });
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during logout'
    });
  }
});

// Get current user
router.get('/me', authenticateSession, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('joinedRooms');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isOnline: user.isOnline,
        lastSeen: user.lastSeen,
        joinedRooms: user.joinedRooms
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/auth/forgot-password
// @desc    Send password reset email
// @access  Public
router.post('/forgot-password', [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email')
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

    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User with this email does not exist'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Set reset token and expiry (10 minutes)
    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    // In a real application, you would send an email here
    // For now, we'll just return the token (remove this in production)
    res.json({
      success: true,
      message: 'Password reset token sent to email',
      resetToken // Remove this in production
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during password reset request'
    });
  }
});

// @route   POST /api/auth/reset-password
// @desc    Reset password with token
// @access  Public
router.post('/reset-password', [
  body('token').notEmpty().withMessage('Reset token is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
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

    const { token, password } = req.body;

    // Hash the token to compare with stored token
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find user with valid reset token
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    // Update password and clear reset token
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Password reset successful'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during password reset'
    });
  }
});

export default router;
