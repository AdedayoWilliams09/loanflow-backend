// backend/seedUser.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from './models/User.js'; // Adjust path if inside src/

dotenv.config();

const seedTestUser = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
    await mongoose.connect(mongoUri);
    console.log('📊 Connected to MongoDB');

    // 1. Force delete any existing user with this email
    await User.deleteOne({ email: 'test@example.com' });
    console.log('🗑️ Removed old test user');

    // 2. Create the user with a fresh PLAIN password
    // (Your pre('save') hook in User.js will hash it ONCE)
    const testUser = new User({
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: 'Password123!',
      authProvider: 'local',
      isEmailVerified: true,
      isActive: true,
      role: 'customer',
    });

    await testUser.save();

    console.log('✅ Fresh test user created successfully!');
    console.log('---------------------------------');
    console.log(' Email:    test@example.com');
    console.log(' Password: Password123!');
    console.log('---------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating test user:', error);
    process.exit(1);
  }
};

seedTestUser();