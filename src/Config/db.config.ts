import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
const app=express()
dotenv.config()

function isDefined<T>(arg: T | undefined): arg is T {
  return arg !== undefined;
}

async function connectToMongoDB() {

  const URI = process.env.NODE_ENV === 'development' ? process.env.MONGODB_URL : process.env.LOCAL_DB;
  console.log("🌍 NODE_ENV:", process.env.NODE_ENV);
  console.log("🛠️ MongoDB URI:", URI); 
  try {
    if (isDefined(URI)) {
      await mongoose.connect(URI, {
        serverSelectionTimeoutMS: 30000, 
      });
      console.log('MongoDB connected successfully');
    } else {
      console.error('MongoDB URI is not defined in environment variables.');
    }
  } catch (error: any) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1); 
  }
}


export default connectToMongoDB;
