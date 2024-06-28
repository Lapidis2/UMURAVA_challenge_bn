import express from "express"
import multer from "multer"
import connectToMongoDB from "./DB/db.config"
import userRoutes from "./Routers/userRoutes"
import { Request,Response } from "express"
import messageRoutes from "./Routers/messageRoute"
import subscribeRoute from "./Routers/subscribeRoute"
import blogRoutes from "./Routers/blogRoutes"
import bodyParser = require("body-parser")
import{Server}from "socket.io"
import cors from "cors"
import http from "http"
import dotenv from "dotenv"
dotenv.config()
const app = express()
app.use(cors())
const server = http.createServer(app);
const io = new Server(server,{
  cors:{
    origin: "*",
    methods: ["GET","POST"],
  
  }
})

io.on('connection',(sokect:any)=>{
  console.log("A user connected")

})

export {io}



app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(express.json())

app.use(
  cors()
);
connectToMongoDB()

const port=process.env.PORT||3000

  app.use('/api',subscribeRoute)
  app.use('/api',messageRoutes)
  app.use('/api',userRoutes)
  app.use('/api',blogRoutes)
  



   app.use('/api',(req:Request,res:Response)=>{
      res.status(200).json({Message:'Welcome to Jean Pierre api site.'})
 })
 app.listen(port,()=>{
    console.log(`Server is running on ${port}`)
 })