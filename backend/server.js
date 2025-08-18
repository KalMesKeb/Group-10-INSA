const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const tutorRoutes = require('./routes/tutor');
const disputeRoutes = require('./routes/dispute');
const adminRoutes = require('./routes/admin');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/tutor', tutorRoutes);
app.use('/api/dispute', disputeRoutes);
app.use('/api/admin', adminRoutes);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("MongoDB connected.");
  app.listen(5000, () => console.log("Server running on port 5000"));
}).catch(err => console.error("DB connection error:", err));
