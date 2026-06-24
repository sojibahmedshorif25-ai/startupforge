import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');

    const adminEmail = 'admin@startupforge.com';
    const existing = await User.findOne({ email: adminEmail });
    if (existing) {
      console.log('Admin already exists!');
      console.log('Email: admin@startupforge.com');
      console.log('Password: Admin123!');
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash('Admin123!', 12);
    await User.create({
      name: 'Admin',
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
      isPremium: true,
    });

    console.log('Admin user created successfully!');
    console.log('Email: admin@startupforge.com');
    console.log('Password: Admin123!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

seedAdmin();
