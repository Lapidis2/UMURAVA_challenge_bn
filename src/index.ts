const express=require('express')
import { Request,Response } from "express"
const app = express()
const port=3000
 app.get("/api",(req:Request,res:Response)=>{
      res.send('Welcome to my api site.')
 })
 app.listen(port,()=>{
    console.log(`Server is running on ${port}`)
 })