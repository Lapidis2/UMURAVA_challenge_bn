import { Request,Response } from "express";
import blogModal from "../Models/blogModal";
export const createBlog=async(req:Request,res:Response)=>{
 try {

    const {title,headline,content}=req.body
    const blogImage=req.file?.filename
    const author=req.body.author||"admin"
const newBlog= await blogModal.create({
    title,headline,content,
    imageUrl:blogImage,
    author,
    createdAt:Date.now(),
    views:[],
    likes:[],
    shares:[],
    Comment:[]
})
res.status(200).json({message:'Blog created successfully',newBlog})
  
 } catch (error) {
    console.log(error)
    res.status(500).json({message:'error creating blog'})

 }
}