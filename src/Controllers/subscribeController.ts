import subscribeModal from "../Models/subscribeModal";
import { Request,Response } from "express";
import nodemailer from "nodemailer"
import dotenv from "dotenv"
dotenv.config();
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, 
    auth: {
      user: process.env.ADMIN_EMAIL,
      pass: process.env.ADMIN_PSWD,
    },

    tls: {
        rejectUnauthorized: false,
    }
  });

  export const Subscribe = async(req: Request, res: Response) =>{
    try{
        const { email } = req.body;

        if(!email){
            return res.status(400).json({ message: "Email is required"});

        }

        const newSubscriber = await subscribeModal.create({ email});
        await newSubscriber.save()

        await transporter.sendMail({
            from: process.env.ADMIN_EMAIL,
            to: email,
            subject: "Welcome to my Blog website",
            html:`<p>Thank you for subscribing to my newsletter, you will be alerted when new blogs are posted!!
            <p>Kind Regards,</p>
            <p>Jean Pierre</p>`
        });

        res.status(200).json({message: "subscription added successfully"});
        subscribeModal.create({ email });
    } catch(err){
        console.log(err);
        res.status(500).json( {message: "Failed to send email"})
    }
  }