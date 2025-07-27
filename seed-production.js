const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

async function seedProduction() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to production MongoDB');

    const existingUsers = await User.countDocuments();
    console.log('Existing users:', existingUsers);

    if (existingUsers === 0) {
      await User.create([
        { firstName: 'Sarah', lastName: 'Administrator', email: 'admin@vidpod.com', password: 'admin123', phoneNumber: '555-0100', role: 'super_admin' },
        { firstName: 'Mike', lastName: 'Manager', email: 'amitrace@vidpod.com', password: 'amitrace123', phoneNumber: '555-0200', role: 'amitrace' },
        { firstName: 'John', lastName: 'Teacher', email: 'teacher@vidpod.com', password: 'teacher123', role: 'teacher' },
        { firstName: 'Emma', lastName: 'Student', email: 'student@vidpod.com', password: 'student123', role: 'student' }
      ]);
      console.log('✅ Production database seeded with test accounts!');
    } else {
      console.log('Database already has users - skipping seed');
    }
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seedProduction();
