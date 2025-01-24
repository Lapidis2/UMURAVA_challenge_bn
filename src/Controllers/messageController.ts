import {Request,Response} from "express"
import messageModal from "../Models/messageModal";
import nodemailer from "nodemailer"
import Mailgen from "mailgen";
import  dotenv  from "dotenv";
dotenv.config()
export const createMessage= async (req:Request,res:Response)=>{
    try {
        const {username,email,message}=req.body;
        if (!username || !email || !message) {
            return res.status(400).json({ message: 'Username, email, and message are required' });
        }
        const newMessage =await messageModal.create({username,email,message})
        await newMessage.save()
        await messageNotify(username,email,message)

        res.status(201).json({message:'The message sent successfull',data:newMessage})
        
    } catch (err: any) {
  
           res.status(500).json({message:"Error while sending a message",error:err.message})
    }
}   




export const getMessage= async(req:Request,res:Response)=>{
    try {
        const messageData= await messageModal.find({})
        res.status(200).json({messageData:'Published messages are:',data:messageData})
    } catch (error: any) {
      console.error("Failed to fetch messages:", error);
        res.status(500).json({error:"Failed to fetch messages"})
    }
}



const messageNotify= async (username: string, email: string, message: string): Promise<void> => {
    try {
        
      const transporter= nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.ADMIN_EMAIL || "",
          pass: process.env.ADMIN_PSWD || "",
        },
      });
  
      const MailGenerator = new Mailgen({
        theme: "default",
        product: {
          name: "Mailgen",
          link: "https://mailgen.js/",
        },
      });
  
      const response = {
        body: {
          name: "Admin Notification",
          intro: `New query from ${username} (${email}):`,
          body: message,
        },
      };
  
      const mail = MailGenerator.generate(response);
  
      const messageOptions = {
        from: email, 
        to: process.env.ADMIN_EMAIL || "", 
        subject: "New Query Received",
        html: mail,
      };
  
      await transporter.sendMail(messageOptions);
     
    } catch (error) {
      console.error("Error sending admin notification email:", error);
      throw error; 
    }
  };
export const replyMessage= async(req:Request,res:Response)=>{
    const {email,replyMessage}=req.body
    try {
         const transporter= await nodemailer.createTransport({
        service:"gmail",
        auth:{
            user:process.env.ADMIN_EMAIL,
            pass:process.env.ADMIN_PSWD
        }
     })
    
   

     let MailGenerator = new Mailgen({
        theme: "default",
        product: {
          name: "Mailgen",
          link: "https://mailgen.js/",
        },
      });
  
      let response = {
        body: {
          name: "I'm Hitayezu Jean Pierre",
          intro: "We have received your message and we will get to yo asap!",
          body: "You will be receiving the updates every time there is new atricle posted",
          outro: "Looking forward to do more business",
        },
      };
  
      let mail = await MailGenerator.generate(response);
      
      const gmail=process.env.ADMIN_EMAIL
      let message = {
        from:gmail,
        to: email,
        subject: "Repy to your query",
        html:mail,
       text:`Reply: ${replyMessage}`
      };
  
      transporter
        .sendMail(message)
        .then(() => {
          return res.status(201).json({
            message: "Reply has been sent successfully",
          });
        })
        .catch((error:any) => {
          return res.status(500).json({ error });
        });
    } catch (error:any) {
      res.status(400).json({ message: error.message });
    }
  };
  
  export const deleteMessage = async (req: Request, res: Response)=> {
    try {
      const { messageId } = req.params;
	  
      const message = await messageModal.findByIdAndDelete(messageId);
  
      if (message) {
        res.status(200).json({
          message: "Message Deleted!"
        });
      } else {
        res.status(404).json({
          message: "Message not found"
        });
      }
    } catch (error) {
      console.error("Error: ", error);
      res.status(500).json({
        message: "Internal Server Error"
      });
    }

  }


