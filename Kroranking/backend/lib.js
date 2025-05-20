// lib.js
import mongoose from "mongoose";

async function dbConnect() {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error("Please define MONGODB_URI in your .env file");
  }

  try{
    const conn = await mongoose.connect(MONGODB_URI);
    console.log("MongoDB connected");
    return conn;
  } 
  catch (err) {
    console.error("MongoDB connection error:", err.message);
    throw err;
  }
}

export default dbConnect;
