const mongoose = require('mongoose');
require('dotenv').config();
const User = require('../models/User');

async function main() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    await User.deleteMany({});

    await User.create([
      { firstName: 'Sarah', lastName: 'Administrator', email: 'admin@vidpod.com', password: 'admin123', phoneNumber: '555-0100', role: 'super_admin' },
      { firstName: 'Mike', lastName: 'Manager', email: 'amitrace@vidpod.com', password: 'amitrace123', phoneNumber: '555-0200', role: 'amitrace' },
      { firstName: 'John', lastName: 'Teacher', email: 'teacher@vidpod.com', password: 'teacher123', role: 'teacher' },
      { firstName: 'Emma', lastName: 'Student', email: 'student@vidpod.com', password: 'student123', role: 'student' }
    ]);

    console.log('✅ Database seeded!');
    console.log('🔑 Test accounts: admin@vidpod.com/admin123, teacher@vidpod.com/teacher123, student@vidpod.com/student123');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

main();
