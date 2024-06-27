import { Request, Response, NextFunction } from 'express';
import jwt, { VerifyErrors } from 'jsonwebtoken';
import dotenv from "dotenv"
import userModal from '../Models/userModal';
dotenv.config()
interface AuthenticatedRequest extends Request {
  user?: DecodedUserPayload;
}

export interface DecodedUserPayload {
  userId: string;
  email: string;
  role: string;
}

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: "Login Required!" });
  }

  try {
    const secret = process.env.SECRETE_KEY as string;
    const decoded = jwt.verify(token, secret) as DecodedUserPayload;
    
    if (decoded) {
      (req as any).user = decoded;
      
      next();
    } else {
      return res.status(403).json({ message: "Access denied. Invalid token." });
    }
  } catch (error) {
    return res.status(403).json({ message: "Error during token verification!" });
  }
};


export const isAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: "Access denied. This route is for Admin only." });
  }
};
