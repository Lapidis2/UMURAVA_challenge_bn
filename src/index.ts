import express from "express"
import connectDb from "./DB/db.config"
import dotenv from "dotenv"
import userRoutes from "./Routers/userRoutes"
import { Request,Response } from "express"
import messageRoutes from "./Routers/messageRoute"
import subscribeRoute from "./Routers/subscribeRoute"
import blogRoutes from "./Routers/blogRoutes"
dotenv.config()
const app = express()
app.use(express.json())
connectDb()
const port=process.env.PORT||3000
 app.get('/api',(req:Request,res:Response)=>{
      res.send('Welcome to my api site.')
 })
  app.use('/api',subscribeRoute)
  app.use('/api',messageRoutes)
  app.use('/api',userRoutes)
  app.use('/api',blogRoutes)
 

 app.listen(port,()=>{
    console.log(`Server is running on ${port}`)
 })