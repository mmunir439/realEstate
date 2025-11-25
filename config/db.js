const mongoose = require("mongoose");
const dotenv = require('dotenv');
dotenv.config();
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB_URL);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1); // Stop the server if DB fails
  }
};

module.exports = connectDB;
