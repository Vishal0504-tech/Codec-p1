import mongoose from 'mongoose';
import dns from 'node:dns';

// Force Node.js to use public DNS resolvers (Cloudflare and Google) 
// to bypass local Windows DNS resolution issues with MongoDB SRV records.
dns.setServers(['1.1.1.1', '8.8.8.8']);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected successfully to host: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
