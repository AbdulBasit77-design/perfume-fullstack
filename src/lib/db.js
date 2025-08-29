import mongoose from 'mongoose';

let cachedConnection = null;

export async function connectDB() {
  // If we already have a connection, return it
  if (cachedConnection) {
    return cachedConnection;
  }

  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.warn('MONGO_URI not set, skipping database connection');
    return null;
  }

  try {
    mongoose.set('strictQuery', true);

    // Connection options for serverless
    const options = {
      bufferCommands: false,
      bufferMaxEntries: 0,
      maxPoolSize: 1,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4
    };

    const connection = await mongoose.connect(uri, options);
    cachedConnection = connection;
    console.log('MongoDB connected');
    return connection;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    // Don't throw error in production, just log it
    if (process.env.NODE_ENV === 'production') {
      console.warn('Continuing without database connection');
      return null;
    }
    throw error;
  }
}

// For serverless functions, we need to handle connection cleanup
export async function closeConnection() {
  if (cachedConnection) {
    try {
      await mongoose.connection.close();
      cachedConnection = null;
      console.log('MongoDB connection closed');
    } catch (error) {
      console.error('Error closing MongoDB connection:', error);
    }
  }
}
