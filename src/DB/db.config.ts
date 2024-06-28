import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
const app=express()
dotenv.config()



const connectDb=async()=>{
    try {
         await mongoose.connect(process.env.MONGDB_URL_hosted!)
         console.log("Database connected success!")
    } catch (error:any) {
        console.log("Error during conncecting db",error.message)
    }
}
  export default connectDb;