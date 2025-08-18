import mongoose from 'mongoose';

const timeSlotSchema = new mongoose.Schema({
  startTime: {
    type: String,
    required: true,
    match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/ // HH:MM format
  },
  endTime: {
    type: String,
    required: true,
    match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/ // HH:MM format
  },
  isBooked: {
    type: Boolean,
    default: false
  },
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session'
  }
});

const dailyAvailabilitySchema = new mongoose.Schema({
  dayOfWeek: {
    type: Number,
    required: true,
    min: 0, // Sunday
    max: 6  // Saturday
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  timeSlots: [timeSlotSchema]
});

const availabilitySchema = new mongoose.Schema({
  tutor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },
  timezone: {
    type: String,
    default: 'UTC'
  },
  weeklySchedule: [dailyAvailabilitySchema],
  // Specific date overrides (for holidays, special availability, etc.)
  dateOverrides: [{
    date: {
      type: Date,
      required: true
    },
    isAvailable: {
      type: Boolean,
      default: false
    },
    timeSlots: [timeSlotSchema],
    reason: String // e.g., "Holiday", "Personal day", etc.
  }],
  // Buffer time between sessions (in minutes)
  bufferTime: {
    type: Number,
    default: 15,
    min: 0,
    max: 60
  },
  // Advance booking settings
  advanceBooking: {
    minHours: {
      type: Number,
      default: 2, // Minimum 2 hours advance booking
      min: 0
    },
    maxDays: {
      type: Number,
      default: 30, // Maximum 30 days advance booking
      min: 1
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Initialize default weekly schedule (Monday-Friday, 9 AM - 5 PM)
availabilitySchema.methods.initializeDefaultSchedule = function() {
  const defaultTimeSlots = [
    { startTime: '09:00', endTime: '10:00' },
    { startTime: '10:00', endTime: '11:00' },
    { startTime: '11:00', endTime: '12:00' },
    { startTime: '13:00', endTime: '14:00' },
    { startTime: '14:00', endTime: '15:00' },
    { startTime: '15:00', endTime: '16:00' },
    { startTime: '16:00', endTime: '17:00' }
  ];

  this.weeklySchedule = [
    { dayOfWeek: 0, isAvailable: false, timeSlots: [] }, // Sunday
    { dayOfWeek: 1, isAvailable: true, timeSlots: [...defaultTimeSlots] }, // Monday
    { dayOfWeek: 2, isAvailable: true, timeSlots: [...defaultTimeSlots] }, // Tuesday
    { dayOfWeek: 3, isAvailable: true, timeSlots: [...defaultTimeSlots] }, // Wednesday
    { dayOfWeek: 4, isAvailable: true, timeSlots: [...defaultTimeSlots] }, // Thursday
    { dayOfWeek: 5, isAvailable: true, timeSlots: [...defaultTimeSlots] }, // Friday
    { dayOfWeek: 6, isAvailable: false, timeSlots: [] }  // Saturday
  ];
};

// Get available slots for a specific date
availabilitySchema.methods.getAvailableSlots = function(date) {
  const dayOfWeek = date.getDay();
  const dateString = date.toDateString();

  // Check for date override first
  const override = this.dateOverrides.find(o => 
    o.date.toDateString() === dateString
  );

  if (override) {
    return override.isAvailable ? 
      override.timeSlots.filter(slot => !slot.isBooked) : [];
  }

  // Use weekly schedule
  const daySchedule = this.weeklySchedule.find(d => d.dayOfWeek === dayOfWeek);
  if (!daySchedule || !daySchedule.isAvailable) {
    return [];
  }

  return daySchedule.timeSlots.filter(slot => !slot.isBooked);
};

// Book a time slot
availabilitySchema.methods.bookSlot = function(date, startTime, sessionId) {
  const dayOfWeek = date.getDay();
  const dateString = date.toDateString();

  // Check for date override first
  const override = this.dateOverrides.find(o => 
    o.date.toDateString() === dateString
  );

  let targetSchedule;
  if (override) {
    targetSchedule = override;
  } else {
    targetSchedule = this.weeklySchedule.find(d => d.dayOfWeek === dayOfWeek);
  }

  if (!targetSchedule) return false;

  const slot = targetSchedule.timeSlots.find(s => s.startTime === startTime);
  if (!slot || slot.isBooked) return false;

  slot.isBooked = true;
  slot.sessionId = sessionId;
  return true;
};

// Release a time slot
availabilitySchema.methods.releaseSlot = function(date, startTime) {
  const dayOfWeek = date.getDay();
  const dateString = date.toDateString();

  const override = this.dateOverrides.find(o => 
    o.date.toDateString() === dateString
  );

  let targetSchedule;
  if (override) {
    targetSchedule = override;
  } else {
    targetSchedule = this.weeklySchedule.find(d => d.dayOfWeek === dayOfWeek);
  }

  if (!targetSchedule) return false;

  const slot = targetSchedule.timeSlots.find(s => s.startTime === startTime);
  if (!slot) return false;

  slot.isBooked = false;
  slot.sessionId = undefined;
  return true;
};

// Indexes
availabilitySchema.index({ 'dateOverrides.date': 1 });

export default mongoose.model('Availability', availabilitySchema);
