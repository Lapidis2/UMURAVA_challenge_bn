import { Request,Response } from "express";
import userModal from "../Models/userModal";
import dotenv from "dotenv"
import bcrypt from "bcrypt" 
import  jwt from "jsonwebtoken"
import crypto from "crypto"
import nodemailer from"nodemailer"
dotenv.config()
export const registerUser=  async(req:Request,res:Response)=>{
    try {
        const {userName,email,password,role} = req.body;
        const existUser= await userModal.findOne({email})
        if(userName=="" && email=="" &&  password==""){
            res.status(400).json({message:'Please fill out all field'})
        }
        if(existUser) {
                res.status(409).json({message:'user already exist'})
           }
           
      const passwordHash= await bcrypt.hash(password,10)
      const user=await userModal.create({
          userName,
          email,
          password:passwordHash,
          role: role || 'Guest'

      })
      await user.save()
    res.status(200).json({message:'Registration successfull!',user:user})
              
    }
        catch (error:any) {
        res.status(500).json({message:'Failed to sign up'})
    }
}

export const loginUser= async(req:Request,res:Response)=>{
    try {
        const {email,password}=req.body;
        if(email=='' || password==''){
            res.status(400).json({message:'Email and Password are required'})
        }
        const user= await userModal.findOne({email})
        if(!user){
            res.status(400).json({message:'Invalid email or password.'})
        }
        else{
        const isPasswordCorrect=await bcrypt.compareSync(password,user.password)
        if(!isPasswordCorrect){
           res.status(400).json({message:'invalid credentials'})
        }
        const token=jwt.sign(
            {userId:user._id,
              email:user.email,
              role:user.role
            },
                process.env.SECRETE_KEY as string,
             {
                expiresIn:"1h"
             }
            )
          
        res.status(200).json({message:'login successfull',token,user})
        }
    } catch (error) {
        res.status(500).json({message:'Failed to sign in'})
    }
}
 export const getAllUser= async(req:Request,res:Response)=>{
    try {
        const users= await userModal.find().select("-Password")
        if(!users){
            res.status(400).json({message:"No registered user found"})
        }
        res.status(200).json({message:"All registered users",users})
    } catch (error) {
        res.status(500).json({message:"error while fetching all users"})
    }
 }

export const getSingleUser= async(req:Request,res:Response)=>{
    try {
        const userId=req.params.userId;
        const oneUser= await userModal.findById(userId)
        if(!oneUser){
            res.status(400).json({message:"user not found"})
        }
        res.status(200).json({oneUser})
    } catch (error) {
                res.status(500).json({message:"error while fetching one user"})

    }
}


export const updateUser= async(req:Request,res:Response)=>{
    const userId=req.params.userId;
    const {userName,email,role}=req.body
    const user=await userModal.findById(userId)
    try{
    if(user){
        
    if(userName){
            user.userName=userName
    }
    if(email){
           user.email=email
    }
    if(role){
        user.role=role
    }
    }
     await user?.save()
     res.status(200).json({message:'User updated successfully',user})
    }
     
    catch(error){
        res.status(500).json({message:"error updating  user"})

    }


    
}
export const deleteUser= async(req:Request,res:Response)=>{
    const userId=req.params.userId;
    const user=await userModal.findById(userId)
    if(!user){
        res.status(400).json({message:'no user with that id'})
    }
     await user?.deleteOne()
     res.status(200).json({message:'User deleted successfully'})

}

export const requestPasswordReset= async(req:Request,res:Response)=>{
    const {email}=req.body
    if(!email){
        res.status(400).json({message:'email is required'})
    }
    try {
    const user= await userModal.findOne({email})
    if(!user){
        res.status(400).json({message:'User not found'})
    }
    else{
    const token= crypto.randomBytes(20).toString('hex')
    const expiration=Date.now()+3600000;
    user.resetPasswordToken=token;
    user.resetPasswordExpire=expiration;
    await user.save()
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: process.env.ADMIN_EMAIL,
          pass: process.env.ADMIN_PSWD,
        },
      });
  
      const response = {
        to: user.email,
        from: process.env.ADMIN_EMAIL,
        subject: 'Password Reset',
        text: `You are receiving this because you ${user.userName} have requested the reset of the password for your account.\n\n
          Please click on the following link, or paste this into your browser to complete the process:\n\n
          http://${req.headers.host}/reset/${token}\n\n
          If you did not request this, please ignore this email and your password will remain unchanged.\n`,
      };
  
      await transporter.sendMail(response);
  
      res.status(200).json({ message: 'Password reset email sent' });

    }
        
    } catch (error) {
        console.error('Error requesting password reset:', error);

                res.status(500).json( {message: " error while requesting reset token"})

    }
}

export const resetPassword= async(req:Request,res:Response)=>{
    try {
        const {password}=req.body
        if(!password){
            res.status(400).json({message:'Password required'})
        }
        const user=await userModal.findOne({resetPasswordToken:req.params.token})
        if(!user){
            res.status(400).json({message:'user not find or reset token expired'})
        }
        else{
        user.password=await bcrypt.hashSync(password,10),
          user.resetPasswordToken= null,
          user.resetPasswordExpire= null
          await user.save();
        
          res.status(200).json({message:'reset password successfull',user})

        }
        
    } catch (error) {
        res.status(500).json( {message: "Error while reseting password"})
       

    }
}






