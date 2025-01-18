import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
const app=express()
dotenv.config()



function isDefined<T>(arg: T | undefined): arg is T {
  return arg !== undefined;
}

async function connectToMongoDB() {
  try {
    if (isDefined(process.env.MONGODB_URL)) {
      const URL= process.env.Local_db
      await mongoose.connect(process.env.Local_db as string, {
        serverSelectionTimeoutMS: 30000,
      });
      console.log('MongoDB connected successfully');
    } else {
      console.error('MONGODB_URL environment variable is not defined.');
    }
  } catch (error:any) {
    console.error('Error connecting to MongoDB:', error.message);
  }
}
connectToMongoDB();
  export default connectToMongoDB;