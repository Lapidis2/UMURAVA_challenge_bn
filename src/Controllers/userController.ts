import { Request,Response } from "express";
import userModal from "../Models/userModal";
import dotenv from "dotenv"
import bcrypt from "bcrypt" 
import  jwt from "jsonwebtoken"
import crypto from "crypto"
import nodemailer from"nodemailer"
dotenv.config()


export const registerUser = async (req: Request, res: Response) => {
    try {
        const { userName, email, password, role } = req.body;
        const existingUser = await userModal.findOne({ email });

        if (!userName || !email || !password) {
            return res.status(400).json({ message: 'Please fill out all fields' });
        }

        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = new userModal({
            userName,
            email,
            password: passwordHash,
            role: role || 'Guest',
            isConfirmed: false, 
            confirmationToken: crypto.randomBytes(20).toString('hex')
        });

        
      const token = jwt.sign(
            {
                userId: newUser._id,
                email: newUser.email,
                role: newUser.role,
            },
            process.env.SECRETE_KEY as string, 
            {
                expiresIn: '1h', 
            }
        );
     await newUser.save();
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.ADMIN_EMAIL,
                pass: process.env.ADMIN_PSWD,
            },
        });

        const confirmationLink = `http://${req.headers.host}/confirm/${newUser.confirmationToken}`;

        const sendEmailResponse = await transporter.sendMail({
            from: process.env.ADMIN_EMAIL,
            to: email,
            subject: 'Account Confirmation',
            html: `
                <div>
                    <p>Dear ${userName},</p>
                    <p>Thank you for registering with us.</p>
                    <p>Please click <a href="${confirmationLink}">here</a> to confirm your email address.</p>
                </div>
            `,
        });

        if (sendEmailResponse) {
            res.status(201).json({
                success: true,
                message: 'User Created Successfully. Please check your email for confirmation instructions.',
                user: newUser,
                token:token
            });
        } else {
            throw new Error('Failed to send confirmation email');
        }

      res.status(201).json({
            success: true,
            message: 'User Created Successfully. Please check your email for confirmation instructions.',
            user: newUser,
            token: token,
        });

        
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Failed to sign up' });
    }
};



export const confirmEmail = async (req: Request, res: Response) => {
    const { token } = req.params;

    try {
        const user = await userModal.findOne({ confirmationToken: token });

        if (!user) {
            return res.status(404).json({ message: 'Invalid or expired token' });
        }

        
        user.isConfirmed = true;
        user.confirmationToken = undefined;
        await user.save();

        res.status(200).json({ message: 'Email confirmed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to confirm email' });
    }
};


export const loginUser= async(req:Request,res:Response)=>{
    try {
        const {email,password}=req.body;
        if(email=='' || password==''){
           return res.status(400).json({message:'Email and Password are required'})
        }
        const user= await userModal.findOne({email})
        if(!user){
           return res.status(400).json({message:'Invalid email or password.'})
        }
        else{
        const isPasswordCorrect=await bcrypt.compareSync(password,user.password)
        if(!isPasswordCorrect){
          return res.status(400).json({message:'invalid credentials'})
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
          
        return res.status(200).json({message:'login successfull',token,user})
        }
    } catch (error:any) {
        console.log(error)
        return res.status(500).json({message:'Failed to sign in',error})
    }
}
 export const getAllUser= async(req:Request,res:Response)=>{
    try {
        const users= await userModal.find().select("-Password").sort({createdAt: -1})
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
        from: process.env.ADMIN_EMAIL,
         to: user.email,
        
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

export const logout = async (req: Request, res: Response) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1]; 
    const secret = process.env.SECRETE_kEY as string;

  try {
     const decoded: any = jwt.verify(token, secret );
    const userId = decoded.userId;
    const user = await userModal.findOne({_id:userId});
  
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.token = user.token.filter((t:String) => t !== token);
    await user.save();

    return res.status(200).json({ message: 'Logout successful' });

  } catch (error) {
    console.error('Error during logout:', error);
    return res.status(500).json({ message: 'Internal server error', error })
  }
};




