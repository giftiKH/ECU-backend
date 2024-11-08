const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000 // 10 seconds   
    });

    console.log('MongoDB connected successfully');
    
  } catch (err) {    
    console.error('MongoDB connection error: ', err.message);
    process.exit(1);     
  }
};

module.exports = connectDB;
