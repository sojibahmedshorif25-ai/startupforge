import mongoose from 'mongoose';

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  
  if (!uri || uri.includes('<db_password>') || uri.includes('your_mongo')) {
    console.warn('⚠️ MONGODB_URI is not properly configured in environment variables');
    console.warn('   Server will start but database operations will fail.');
    console.warn('   Set MONGODB_URI in Render Environment Variables.');
    return null;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.warn('   Server will continue without database.');
    console.warn('   Make sure MONGODB_URI is correct in Render Environment Variables.');
    return null;
  }
};

export default connectDB;
