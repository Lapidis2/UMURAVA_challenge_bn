import express from "express"
import connectDb from "../DB/db.config"
import dotenv from "dotenv"
dotenv.config()
import { Request,Response } from "express"
import messageRoutes from "./Routers/messageRoute"
import subscribeRoute from "./Routers/subscribe"
const app = express()
app.use(express.json())
connectDb()
const port=process.env.PORT||5000
 app.get('/api',(req:Request,res:Response)=>{
      res.send('Welcome to my api site.')
 })
  app.use('/api',subscribeRoute)
  app.use('/api',messageRoutes)










 app.listen(port,()=>{
    console.log(`Server is running on ${port}`)
 })