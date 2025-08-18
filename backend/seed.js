const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const User = require('./models/User');
const TutorProfile = require('./models/TutorProfile');
const Dispute = require('./models/Dispute');
const Session = require('./models/Session');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/tutoring-platform';

async function seedDatabase() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("🚀 Connected to MongoDB...");

    await User.deleteMany();
    await TutorProfile.deleteMany();
    await Dispute.deleteMany();
    await Session.deleteMany();

    const password = await bcrypt.hash('password123', 10);

    const admin = new User({ email: 'admin@example.com', password, role: 'admin', name: 'Admin User' });
    const tutor1 = new User({ email: 'tutor1@example.com', password, role: 'tutor', name: 'Tutor One' });
    const tutor2 = new User({ email: 'tutor2@example.com', password, role: 'tutor', name: 'Tutor Two' });
    const student1 = new User({ email: 'student1@example.com', password, role: 'student', name: 'Student One' });
    const student2 = new User({ email: 'student2@example.com', password, role: 'student', name: 'Student Two' });

    await admin.save();
    await tutor1.save();
    await tutor2.save();
    await student1.save();
    await student2.save();

    console.log("Users created");

    const profile1 = new TutorProfile({
      userId: tutor1._id,
      subjects: ['Math', 'Physics'],
      bio: 'Experienced Math and Physics tutor.',
      experience: '5 years tutoring high school students.',
      availability: 'Weekdays 5pm-9pm'
    });

    const profile2 = new TutorProfile({
      userId: tutor2._id,
      subjects: ['English', 'History'],
      bio: 'Former college lecturer in English.',
      experience: '10 years teaching experience.',
      availability: 'Weekends 10am-4pm'
    });

    await profile1.save();
    await profile2.save();

    console.log("Tutor profiles created");

    const dispute1 = new Dispute({
      createdBy: student1._id,
      message: 'Tutor didn’t show up for the session.',
      status: 'open'
    });

    const dispute2 = new Dispute({
      createdBy: tutor1._id,
      message: 'Student was abusive during the session.',
      status: 'resolved'
    });

    await dispute1.save();
    await dispute2.save();

    console.log("Disputes created");

    const session1 = new Session({
      roomId: 'room123',
      tutorId: tutor1._id,
      studentId: student1._id,
      startedAt: new Date(Date.now() - 3600000),
      endedAt: new Date(),
      status: 'ended'
    });

    const session2 = new Session({
      roomId: 'room456',
      tutorId: tutor2._id,
      studentId: student2._id,
      startedAt: new Date(),
      status: 'active'
    });

    await session1.save();
    await session2.save();

    console.log("Sessions created");

    console.log("Database seeded successfully!");

    process.exit(0);
  } catch (err) {
    console.error("Error seeding database:", err);
    process.exit(1);
  }
}

seedDatabase();
