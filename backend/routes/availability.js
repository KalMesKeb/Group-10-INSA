import express from 'express';
import { body, validationResult } from 'express-validator';
import Availability from '../models/Availability.js';
import { authenticateSession, authorizeRoles } from '../middleware/session.js';

const router = express.Router();

// @route   GET /api/availability/:tutorId
// @desc    Get tutor availability
// @access  Public
router.get('/:tutorId', async (req, res) => {
  try {
    const { tutorId } = req.params;
    const { date, days = 7 } = req.query;

    let availability = await Availability.findOne({ tutor: tutorId });
    
    if (!availability) {
      return res.status(404).json({
        success: false,
        message: 'Availability not found for this tutor'
      });
    }

    // If specific date requested, return slots for that date
    if (date) {
      const requestedDate = new Date(date);
      const availableSlots = availability.getAvailableSlots(requestedDate);
      
      return res.json({
        success: true,
        data: {
          date: requestedDate,
          availableSlots,
          timezone: availability.timezone,
          bufferTime: availability.bufferTime
        }
      });
    }

    // Return availability for next N days
    const result = [];
    const today = new Date();
    
    for (let i = 0; i < parseInt(days); i++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);
      
      const availableSlots = availability.getAvailableSlots(currentDate);
      
      result.push({
        date: currentDate,
        dayOfWeek: currentDate.getDay(),
        availableSlots: availableSlots.length,
        slots: availableSlots
      });
    }

    res.json({
      success: true,
      data: {
        availability: result,
        timezone: availability.timezone,
        bufferTime: availability.bufferTime,
        advanceBooking: availability.advanceBooking
      }
    });

  } catch (error) {
    console.error('Error fetching availability:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching availability'
    });
  }
});

// @route   POST /api/availability
// @desc    Create or update tutor availability
// @access  Private (Tutor only)
router.post('/', 
  authenticateSession,
  authorizeRoles('tutor'),
  [
    body('timezone').optional().isString().withMessage('Timezone must be a string'),
    body('bufferTime').optional().isInt({ min: 0, max: 60 }).withMessage('Buffer time must be between 0 and 60 minutes'),
    body('weeklySchedule').optional().isArray().withMessage('Weekly schedule must be an array')
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

    const tutorId = req.user.id;
    const { timezone, bufferTime, weeklySchedule, advanceBooking } = req.body;

    let availability = await Availability.findOne({ tutor: tutorId });

    if (!availability) {
      // Create new availability
      availability = new Availability({ tutor: tutorId });
      availability.initializeDefaultSchedule();
    }

    // Update fields if provided
    if (timezone) availability.timezone = timezone;
    if (bufferTime !== undefined) availability.bufferTime = bufferTime;
    if (weeklySchedule) availability.weeklySchedule = weeklySchedule;
    if (advanceBooking) availability.advanceBooking = advanceBooking;

    await availability.save();

    res.json({
      success: true,
      message: 'Availability updated successfully',
      data: availability
    });

  } catch (error) {
    console.error('Error updating availability:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating availability'
    });
  }
});

// @route   PUT /api/availability/schedule
// @desc    Update weekly schedule
// @access  Private (Tutor only)
router.put('/schedule', 
  authenticateSession,
  authorizeRoles('tutor'),
  [
    body('dayOfWeek').isInt({ min: 0, max: 6 }).withMessage('Day of week must be between 0 and 6'),
    body('isAvailable').isBoolean().withMessage('isAvailable must be boolean'),
    body('timeSlots').optional().isArray().withMessage('Time slots must be an array')
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

    const tutorId = req.user.id;
    const { dayOfWeek, isAvailable, timeSlots } = req.body;

    let availability = await Availability.findOne({ tutor: tutorId });
    if (!availability) {
      return res.status(404).json({
        success: false,
        message: 'Availability not found. Please create availability first.'
      });
    }

    // Find and update the specific day
    const daySchedule = availability.weeklySchedule.find(d => d.dayOfWeek === dayOfWeek);
    if (!daySchedule) {
      availability.weeklySchedule.push({
        dayOfWeek,
        isAvailable,
        timeSlots: timeSlots || []
      });
    } else {
      daySchedule.isAvailable = isAvailable;
      if (timeSlots) daySchedule.timeSlots = timeSlots;
    }

    await availability.save();

    res.json({
      success: true,
      message: 'Schedule updated successfully',
      data: availability.weeklySchedule
    });

  } catch (error) {
    console.error('Error updating schedule:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating schedule'
    });
  }
});

// @route   POST /api/availability/override
// @desc    Add date override (holiday, special availability)
// @access  Private (Tutor only)
router.post('/override', 
  authenticateSession,
  authorizeRoles('tutor'),
  [
    body('date').isISO8601().withMessage('Date must be in ISO format'),
    body('isAvailable').isBoolean().withMessage('isAvailable must be boolean'),
    body('reason').optional().isString().withMessage('Reason must be a string')
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

    const tutorId = req.user.id;
    const { date, isAvailable, timeSlots, reason } = req.body;

    let availability = await Availability.findOne({ tutor: tutorId });
    if (!availability) {
      return res.status(404).json({
        success: false,
        message: 'Availability not found. Please create availability first.'
      });
    }

    const overrideDate = new Date(date);
    
    // Remove existing override for the same date
    availability.dateOverrides = availability.dateOverrides.filter(
      override => override.date.toDateString() !== overrideDate.toDateString()
    );

    // Add new override
    availability.dateOverrides.push({
      date: overrideDate,
      isAvailable,
      timeSlots: timeSlots || [],
      reason
    });

    await availability.save();

    res.json({
      success: true,
      message: 'Date override added successfully',
      data: availability.dateOverrides
    });

  } catch (error) {
    console.error('Error adding date override:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding date override'
    });
  }
});

// @route   DELETE /api/availability/override/:date
// @desc    Remove date override
// @access  Private (Tutor only)
router.delete('/override/:date', authenticateSession, authorizeRoles('tutor'), async (req, res) => {
  try {
    const tutorId = req.user.id;
    const { date } = req.params;

    let availability = await Availability.findOne({ tutor: tutorId });
    if (!availability) {
      return res.status(404).json({
        success: false,
        message: 'Availability not found'
      });
    }

    const targetDate = new Date(date);
    availability.dateOverrides = availability.dateOverrides.filter(
      override => override.date.toDateString() !== targetDate.toDateString()
    );

    await availability.save();

    res.json({
      success: true,
      message: 'Date override removed successfully'
    });

  } catch (error) {
    console.error('Error removing date override:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while removing date override'
    });
  }
});

// @route   POST /api/availability/book-slot
// @desc    Book a time slot (used internally by session booking)
// @access  Private
router.post('/book-slot', authenticateSession, async (req, res) => {
  try {
    const { tutorId, date, startTime, sessionId } = req.body;

    let availability = await Availability.findOne({ tutor: tutorId });
    if (!availability) {
      return res.status(404).json({
        success: false,
        message: 'Availability not found for this tutor'
      });
    }

    const bookingDate = new Date(date);
    const success = availability.bookSlot(bookingDate, startTime, sessionId);

    if (!success) {
      return res.status(400).json({
        success: false,
        message: 'Time slot is not available or already booked'
      });
    }

    await availability.save();

    res.json({
      success: true,
      message: 'Time slot booked successfully'
    });

  } catch (error) {
    console.error('Error booking slot:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while booking slot'
    });
  }
});

// @route   POST /api/availability/release-slot
// @desc    Release a time slot (used when session is cancelled)
// @access  Private
router.post('/release-slot', authenticateSession, async (req, res) => {
  try {
    const { tutorId, date, startTime } = req.body;

    let availability = await Availability.findOne({ tutor: tutorId });
    if (!availability) {
      return res.status(404).json({
        success: false,
        message: 'Availability not found for this tutor'
      });
    }

    const releaseDate = new Date(date);
    const success = availability.releaseSlot(releaseDate, startTime);

    if (!success) {
      return res.status(400).json({
        success: false,
        message: 'Time slot not found'
      });
    }

    await availability.save();

    res.json({
      success: true,
      message: 'Time slot released successfully'
    });

  } catch (error) {
    console.error('Error releasing slot:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while releasing slot'
    });
  }
});

export default router;
