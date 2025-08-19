import express from 'express';
import { body, validationResult } from 'express-validator';
import Room from '../models/Room.js';
import User from '../models/User.js';
import { authenticateSession } from '../middleware/session.js';

const router = express.Router();

// Create a new room
router.post('/create', authenticateSession, [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Room name must be between 1 and 100 characters'),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('maxParticipants')
    .optional()
    .isInt({ min: 2, max: 50 })
    .withMessage('Max participants must be between 2 and 50')
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

    const { name, description, maxParticipants, settings } = req.body;

    // Generate unique room ID
    const roomId = Math.random().toString(36).substr(2, 9);

    const room = new Room({
      roomId,
      name,
      description: description || '',
      host: req.user.id,
      maxParticipants: maxParticipants || 10,
      settings: {
        allowChat: settings?.allowChat !== false,
        allowScreenShare: settings?.allowScreenShare !== false,
        requirePassword: settings?.requirePassword || false,
        password: settings?.password || null
      },
      participants: [{
        user: req.user.id,
        role: 'host'
      }]
    });

    await room.save();

    // Add room to user's joined rooms
    await User.findByIdAndUpdate(req.user.id, {
      $push: { joinedRooms: room._id }
    });

    const populatedRoom = await Room.findById(room._id)
      .populate('host', 'username email')
      .populate('participants.user', 'username email');

    res.status(201).json({
      success: true,
      message: 'Room created successfully',
      room: populatedRoom
    });
  } catch (error) {
    console.error('Create room error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating room'
    });
  }
});

// Join a room
router.post('/join/:roomId', authenticateSession, async (req, res) => {
  try {
    const { roomId } = req.params;
    const { password } = req.body;

    const room = await Room.findOne({ roomId, isActive: true });
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found or inactive'
      });
    }

    // Check if room requires password
    if (room.settings.requirePassword && room.settings.password !== password) {
      return res.status(403).json({
        success: false,
        message: 'Invalid room password'
      });
    }

    // Check if room is full
    if (room.participants.length >= room.maxParticipants) {
      return res.status(400).json({
        success: false,
        message: 'Room is full'
      });
    }

    // Check if user is already in the room
    const isAlreadyParticipant = room.participants.some(
      p => p.user.toString() === req.user.id
    );

    if (!isAlreadyParticipant) {
      room.participants.push({
        user: req.user.id,
        role: 'participant'
      });
      await room.save();

      // Add room to user's joined rooms
      await User.findByIdAndUpdate(req.user.id, {
        $addToSet: { joinedRooms: room._id }
      });
    }

    const populatedRoom = await Room.findById(room._id)
      .populate('host', 'username email')
      .populate('participants.user', 'username email');

    res.json({
      success: true,
      message: 'Joined room successfully',
      room: populatedRoom
    });
  } catch (error) {
    console.error('Join room error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while joining room'
    });
  }
});

// Leave a room
router.post('/leave/:roomId', authenticateSession, async (req, res) => {
  try {
    const { roomId } = req.params;

    const room = await Room.findOne({ roomId });
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    // Remove user from participants
    room.participants = room.participants.filter(
      p => p.user.toString() !== req.user.id
    );

    // If host leaves and there are other participants, assign new host
    if (room.host.toString() === req.user.id && room.participants.length > 0) {
      const newHost = room.participants[0];
      room.host = newHost.user;
      newHost.role = 'host';
    }

    // If no participants left, deactivate room
    if (room.participants.length === 0) {
      room.isActive = false;
      room.endTime = new Date();
    }

    await room.save();

    // Remove room from user's joined rooms
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { joinedRooms: room._id }
    });

    res.json({
      success: true,
      message: 'Left room successfully'
    });
  } catch (error) {
    console.error('Leave room error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while leaving room'
    });
  }
});

// Get room details
router.get('/:roomId', authenticateSession, async (req, res) => {
  try {
    const { roomId } = req.params;

    const room = await Room.findOne({ roomId })
      .populate('host', 'username email isOnline')
      .populate('participants.user', 'username email isOnline')
      .populate('chatHistory.user', 'username');

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    res.json({
      success: true,
      room
    });
  } catch (error) {
    console.error('Get room error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching room'
    });
  }
});

// Get user's rooms
router.get('/user/rooms', authenticateSession, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'joinedRooms',
      populate: {
        path: 'host participants.user',
        select: 'username email isOnline'
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      rooms: user.joinedRooms
    });
  } catch (error) {
    console.error('Get user rooms error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user rooms'
    });
  }
});

// Add chat message to room
router.post('/:roomId/chat', authenticateSession, [
  body('message')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Message must be between 1 and 1000 characters')
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

    const { roomId } = req.params;
    const { message } = req.body;

    const room = await Room.findOne({ roomId });
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    // Check if user is participant
    const isParticipant = room.participants.some(
      p => p.user.toString() === req.user.id
    );

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'You are not a participant in this room'
      });
    }

    const user = await User.findById(req.user.id);
    
    const chatMessage = {
      user: req.user.id,
      username: user.username,
      message,
      timestamp: new Date()
    };

    room.chatHistory.push(chatMessage);
    await room.save();

    res.json({
      success: true,
      message: 'Chat message added successfully',
      chatMessage
    });
  } catch (error) {
    console.error('Add chat message error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding chat message'
    });
  }
});

// Start session tracking
router.post('/:roomId/start-tracking', authenticateSession, async (req, res) => {
  try {
    const { roomId } = req.params;

    const room = await Room.findOne({ roomId });
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    room.sessionStartTime = new Date();
    await room.save();

    res.json({
      success: true,
      message: 'Session tracking started',
      startTime: room.sessionStartTime
    });
  } catch (error) {
    console.error('Start session tracking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while starting session tracking'
    });
  }
});

// End session tracking
router.post('/:roomId/end-tracking', authenticateSession, async (req, res) => {
  try {
    const { roomId } = req.params;
    const { duration } = req.body;

    const room = await Room.findOne({ roomId });
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    room.sessionDuration = duration;
    room.sessionEndTime = new Date();
    await room.save();

    res.json({
      success: true,
      message: 'Session tracking ended',
      duration: room.sessionDuration
    });
  } catch (error) {
    console.error('End session tracking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while ending session tracking'
    });
  }
});


export default router;
