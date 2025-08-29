// Test script to debug deployment issues
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

console.log('=== Deployment Test Script ===\n');

// Check environment variables
console.log('Environment Variables:');
console.log('NODE_ENV:', process.env.NODE_ENV || 'not set');
console.log('MONGO_URI:', process.env.MONGO_URI ? '✓ Set' : '✗ Missing');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✓ Set' : '✗ Missing');
console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME ? '✓ Set' : '✗ Missing');

// Test MongoDB connection
if (process.env.MONGO_URI) {
    console.log('\nTesting MongoDB connection...');
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            bufferCommands: false,
            bufferMaxEntries: 0,
            maxPoolSize: 1,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            family: 4
        });
        console.log('✓ MongoDB connection successful');

        // Test basic operations
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('✓ Database accessible, collections:', collections.map(c => c.name));

        await mongoose.connection.close();
        console.log('✓ Connection closed successfully');
    } catch (error) {
        console.error('✗ MongoDB connection failed:', error.message);
    }
} else {
    console.log('\n✗ Cannot test MongoDB - MONGO_URI not set');
}

console.log('\n=== Test Complete ===');
console.log('\nIf you see any ✗ marks above, those issues need to be fixed in Vercel environment variables.');
console.log('Check the DEPLOYMENT.md file for setup instructions.');
