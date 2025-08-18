import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { Server } from 'socket.io';
import session from 'express-session';
import { RedisStore } from 'connect-redis';
import redisClient from './config/redis.js';

// Import routes
import authRoutes from './routes/auth.js';
import roomRoutes from './routes/rooms.js';
import userRoutes from './routes/users.js';
import tutorApplicationRoutes from './routes/tutorApplications.js';
import sessionRoutes from './routes/sessions.js';
import disputeRoutes from './routes/disputes.js';
import adminRoutes from './routes/admin.js';
import uploadRoutes from './routes/uploads.js';
import tutorRoutes from './routes/tutors.js';
import contactRoutes from './routes/contact.js';
import notificationRoutes from './routes/notifications.js';
import statsRoutes from './routes/stats.js';
import availabilityRoutes from './routes/availability.js';

// Load environment variables
dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5000;

// Redis client is already connected via config/redis.js

// Configure session store
const store = new RedisStore({
  client: redisClient,
  prefix: 'sess:',
});

// Session middleware
app.use(session({
  store: store,
  secret: process.env.SESSION_SECRET || process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  name: 'sessionId',
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24, // 24 hours
    sameSite: 'strict'
  }
}));

// Security middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Database connection (optional - Redis sessions work independently)
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/livesession', {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
  .then(() => {
    console.log('✅ Connected to MongoDB');
  })
  .catch((error) => {
    console.warn('⚠️ MongoDB connection failed - Redis sessions still functional:', error.message);
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tutor-applications', tutorApplicationRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/disputes', disputeRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/tutors', tutorRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/availability', availabilityRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Ethio Tutors Backend Server is running',
    timestamp: new Date().toISOString()
  });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`🔌 User connected: ${socket.id}`);

  // Join room
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).emit('user-connected', userId);
    console.log(`👤 User ${userId} joined room ${roomId}`);
  });

  // Handle peer connection
  socket.on('peer-connected', (roomId, peerId) => {
    socket.to(roomId).emit('peer-connected', peerId);
  });

  // Handle chat messages
  socket.on('chat-message', (roomId, message) => {
    socket.to(roomId).emit('chat-message', message);
  });

  // Handle screen sharing
  socket.on('screen-share', (roomId, isSharing) => {
    socket.to(roomId).emit('screen-share', isSharing);
  });

  // Handle user disconnect
  socket.on('disconnect', () => {
    console.log(`🔌 User disconnected: ${socket.id}`);
  });

  // Leave room
  socket.on('leave-room', (roomId, userId) => {
    socket.leave(roomId);
    socket.to(roomId).emit('user-disconnected', userId);
    console.log(`👤 User ${userId} left room ${roomId}`);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Client URL: ${process.env.CLIENT_URL || 'http://localhost:5173'}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});
