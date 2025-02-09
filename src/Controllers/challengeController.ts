import { Request, Response,NextFunction } from "express";
import blogModal from "../Models/challengeModal";
import dotenv from "dotenv";
import subscribeModal from "../Models/subscribeModal";
import nodemailer from "nodemailer"
import { DecodedUserPayload } from "../middleWare/verifyToken";
 interface AuthenticatedRequest extends Request {
    user?:DecodedUserPayload; 
}
dotenv.config();

interface AuthenticatedRequest extends Request {
  token?: string;
}

export const createBlog = async (req: Request, res: Response) => {
  try {
    const { title, skills, timeline, seniority, status } = req.body;

    if (!title || !skills || !timeline || !seniority || !status) {
      return res.status(400).json({ message: "please fill all fields" });
    }

    const BlogData = new blogModal({
      title,
      skills,
      seniority,
      timeline,
      status,
    });

    const blogs: any = await BlogData.save();

    if (blogs) {
      const selectEmails: any = await subscribeModal.find();
      if (selectEmails.length > 0) {
        const transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          auth: {
            user: process.env.ADMIN_EMAIL,
            pass: process.env.ADMIN_PSWD,
          },
          tls: {
            rejectUnauthorized: false,
          },
        });

        try {
          const emails = selectEmails.map((emailData: any) => {
            return transporter.sendMail({
              from: process.env.ADMIN_EMAIL,
              to: emailData.email,
              subject: "New Challenge Added",
              html: `
                <div style="font-family: Arial, sans-serif; margin: 0; padding: 10px; background-color: #f4f4f4;">
                  <div style="max-width: 600px; margin: 20px auto; padding: 20px; background-color: #fff; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                    <h1 style="color: #333;">New challenge Notification</h1>
                    <h2 style="font-size: 24px; margin-bottom: 10px;">${BlogData.title}</h2>
                    <p style="color: #666;">Hello there!</p>
                    <p style="color: #666;">We're excited to inform you that a new challenge post has been added to our website.</p>
                    <p style="color: #666;">Check it out now:</p>
                    <a href="https://umurava-challenge.netlify.app/openedblog?id=${blogs._id}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;">Read challenge here</a>
                    <p style="color: #666;">If you have any questions or feedback, feel free to reply to this email.</p>
                    <p style="color: #666;">Thank you for being a valued subscriber!</p>
                    <p style="color: #666;">Best Regards,<br>Umurava Tech</p>
                  </div>
                </div>
              `,
            });
          });

          await Promise.all(emails);

          return res.status(201).json({
            status: "success",
            message: "Notifications sent to all subscribers",
            blogs,
          });
        } catch (emailError) {
          console.error("Error sending emails:", emailError);
          return res.status(500).json({
            message: "Error sending notifications to subscribers",
            error: emailError,
          });
        }
      }
    }
 
  } catch (error) {
    console.error("Error creating blog:", error);
    return res.status(500).json({ message: "Error creating blog", error });
  }
};

export const getBlogs = async (req: Request, res: Response) => {
  
	try {
	  const blogData = await blogModal.find().sort({ _id: -1 });
  
	  if (blogData.length > 0) {
		return res.status(200).json({ message: "Success", blog: blogData });
	  } else {
		return res.status(404).json({ message: "No blogs available" });
	  }
	} catch (error: any) {
	  return res.status(500).json({ message: "Internal server error", error: error.message });
	}
}

export const getSingleBlog = async ( req: Request,res: Response)=>{
  try {

    const {id} = req.params
    const blog = await blogModal.findById(id)
    if(blog){
      res.status(200).json({blog: blog})
    }else{
      res.status(404).json({message:"no blog available"})
    }
    
  } catch (error:any) {
    res.status(500).json({ message: error.message });
    
  }
}

export const deleteBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const deleteD = await blogModal.findByIdAndDelete(id,{new:true});
    if(deleteD){
      res.status(200).json({
        message:"Blog Delete successfully",
      })
    }
    if (!deleteD) {
      res.status(404).json({ message: "No blog found" });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBlog = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const checkBlog = await blogModal.findById(id);
    if (!checkBlog) {
      return res.status(404).json({ message: "Blog post not found" });
	}
    upload(req, res, async (err) => {
      if (err) {
        return res.status(500).json({ message: "Error uploading file", error: err });
      }

      const { title, headline, content } = req.body;
      const imageUrl: any = req.file?.path;
      let updateData: any = { title, headline, content };
      if (imageUrl) {
        try {
          const result = await cloudinary.uploader.upload(imageUrl, { folder: "uploads" });
          updateData.imageUrl = result.secure_url; 
        } catch (cloudinaryError) {
          return res.status(500).json({ message: "Error uploading image to Cloudinary", error:err.message });
        }
      }

      const updatedBlog = await blogModal.findByIdAndUpdate(id, updateData, { new: true });
      if (updatedBlog) {
        return res.status(200).json({ message: "Blog updated successfully", updatedBlog });
      } else {
        return res.status(404).json({ message: "Blog post not found for updating" });
      }
    });
  } catch (error: any) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};





}





