const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/placeprep_ai', {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`[MongoDB Warning] Could not connect to MongoDB instance (${error.message}).`);
    console.warn(`[MongoDB] Make sure MongoDB server is running on ${process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/placeprep_ai'}`);
  }
};

module.exports = connectDB;
