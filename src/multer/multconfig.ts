import { Request, Response } from 'express';
import multer from 'multer';
const cloudinary = require('cloudinary').v2;
import  Dotenv from 'dotenv';
Dotenv.config()
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});


const storage = multer.diskStorage({
    destination: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) {
        cb(null, './uploads'); 
    },
    filename: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) {
        cb(null, file.originalname); 
    }
});



const upload = multer({ storage }).single('file'); 

export const uploadFile = async (req: Request, res: Response) => {
    try {
       
        upload(req, res, async (err: any) => {
            if (err) {
                console.error('Error uploading file:', err);
                return res.status(500).json({ message: 'Error uploading file' });
            }

           
            const imagePath: string | null = req.file ? req.file.path : null;
            let imageUrl: string = '';

            if (imagePath) {
               
                const result = await cloudinary.uploader.upload(imagePath);
                imageUrl = result.secure_url;
            }

            res.status(200).json({ imageUrl });
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error uploading file' });
    }
};
