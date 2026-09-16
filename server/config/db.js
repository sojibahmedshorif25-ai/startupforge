import mongoose from 'mongoose';
import dns from 'dns';

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
  if (dns.setDefaultResultOrder) dns.setDefaultResultOrder('ipv4first');
} catch (e) {}

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri || uri.includes('YOUR_PASSWORD_HERE') || uri.includes('<db_password>')) {
    console.warn('⚡ MONGODB_URI placeholder detected. StartupForge is running seamlessly with Fallback Store.');
    console.warn('   Update MONGODB_URI in server/.env with your real MongoDB Atlas password to switch to live DB.');
    return null;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
      socketTimeoutMS: 10000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(`⚡ MongoDB Atlas connection unsuccessful (${error.message}).`);
    console.warn('   StartupForge is running smoothly with Fallback Mock Database.');
    return null;
  }
};

export default connectDB;
