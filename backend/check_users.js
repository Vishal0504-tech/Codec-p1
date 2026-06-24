import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import dns from 'node:dns';

dotenv.config();
dns.setServers(['1.1.1.1', '8.8.8.8']);

const checkUsers = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('Error: MONGODB_URI environment variable is missing.');
      process.exit(1);
    }
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Successfully connected to MongoDB.');
    const users = await User.find({}, 'name email role createdAt');
    console.log('\n--- Registered Users ---');
    users.forEach((user) => {
      console.log(`- ID: ${user._id} | Name: ${user.name} | Email: ${user.email} | Role: ${user.role}`);
    });
    console.log('------------------------\n');
    process.exit(0);
  } catch (error) {
    console.error('Error connecting or querying users:', error.message);
    process.exit(1);
  }
};

checkUsers();
