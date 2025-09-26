import { Request, Response } from "express";
import userModal from "../Models/userModal";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { isAdmin } from "../middleWare/verifyToken";

dotenv.config();

// --- REGISTER USER ---
export const registerUser = async (req: Request, res: Response) => {
    try {
        const { userName, email, password, role } = req.body;

        if (!userName || !email || !password) {
            return res.status(400).json({ message: 'Please fill out all fields' });
        }

        const existingUser = await userModal.findOne({ email }).sort({ createdAt: -1 });
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const rawToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

        const newUser = new userModal({
            userName,
            email,
            password: passwordHash,
            role: role || 'talent',
            isConfirmed: false,
            confirmationToken: hashedToken,
            confirmationExpires: Date.now() + 24 * 60 * 60 * 1000,
        });

        await newUser.save();

        const token = jwt.sign(
            { userId: newUser._id, email: newUser.email, role: newUser.role },
            process.env.SECRETE_KEY as string,
            { expiresIn: '1h' }
        );

        res.status(201).json({
            success: true,
            message: 'User Created Successfully. Please check your email for confirmation instructions.',
            user: newUser,
            token,
        });

        // Send email asynchronously
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: { user: process.env.ADMIN_EMAIL, pass: process.env.ADMIN_PSWD },
        });

        const confirmationLink = `https://umurava-skill-challenge.netlify.app/confirm/${rawToken}`;
        transporter.sendMail({
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
        }).catch(err => console.error('Email sending failed:', err));

    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Failed to sign up' });
    }
};

// --- LOGIN USER ---
export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and Password are required' });
        }

        const user = await userModal.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email, userName: user.userName, role: user.role },
            process.env.SECRETE_KEY as string,
            { expiresIn: "1h" }
        );

        return res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                userName: user.userName,
                email: user.email,
                role: user.role,
            }
        });

    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to sign in', error: error.message });
    }
};

// --- GET ALL USERS ---
export const getAllUser = async (req: Request, res: Response) => {
    try {
        const users = await userModal.find().select("-Password").sort({ createdAt: -1 });
        if (!users) {
            return res.status(404).json({ message: "No registered user found" });
        }
        res.status(200).json({ message: "All registered users", users });
    } catch (error) {
        res.status(500).json({ message: "Error while fetching all users" });
    }
};

// --- GET SINGLE USER ---
export const getSingleUser = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        if (!userId || userId.length !== 24) {
            return res.status(400).json({ message: "Invalid user ID format." });
        }
        const oneUser = await userModal.findById(userId);
        if (!oneUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ oneUser });
    } catch (error) {
        res.status(500).json({ message: "Error while fetching one user" });
    }
};

// --- UPDATE USER ---
export const updateUser = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        const { userName, email, role } = req.body;
        if (!userName && !email) {
            return res.status(400).json({ message: "Invalid input or missing required fields." });
        }
        const user = await userModal.findByIdAndUpdate(userId, { userName, email, role }, { new: true });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        res.status(200).json({ message: "User updated successfully.", user });
    } catch (error) {
        res.status(500).json({ message: "Error updating user" });
    }
};

// --- DELETE USER ---
export const deleteUser = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        const user = await userModal.findById(userId);
        if (!user) {
            return res.status(400).json({ message: 'No user with that ID' });
        }
        await user.deleteOne();
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user" });
    }
};

// --- REQUEST PASSWORD RESET ---
export const requestPasswordReset = async (req: Request, res: Response) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    try {
        const user = await userModal.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User not found' });

        const token = crypto.randomBytes(20).toString('hex');
        const expiration = Date.now() + 3600000;
        user.resetPasswordToken = token;
        user.resetPasswordExpire = expiration;
        await user.save();

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: { user: process.env.ADMIN_EMAIL, pass: process.env.ADMIN_PSWD },
        });

        await transporter.sendMail({
            from: process.env.ADMIN_EMAIL,
            to: user.email,
            subject: 'Password Reset',
            text: `Hello ${user.userName},\n\nPlease click the link to reset your password:\nhttp://${req.headers.host}/reset/${token}\n\nIf you did not request this, ignore this email.\n`,
        });

        res.status(200).json({ message: 'Password reset email sent' });
    } catch (error) {
        console.error('Error requesting password reset:', error);
        res.status(500).json({ message: "Error while requesting reset token" });
    }
};

// --- RESET PASSWORD ---
export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { password } = req.body;
        if (!password) return res.status(400).json({ message: 'Password required' });

        const user = await userModal.findOne({ resetPasswordToken: req.params.token });
        if (!user) return res.status(400).json({ message: 'User not found or reset token expired' });

        user.password = await bcrypt.hashSync(password, 10);
        user.resetPasswordToken = null;
        user.resetPasswordExpire = null;
        await user.save();

        res.status(200).json({ message: 'Reset password successful', user });
    } catch (error) {
        res.status(500).json({ message: "Error while resetting password" });
    }
};

// --- LOGOUT ---
export const logout = async (req: Request, res: Response) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ message: 'Unauthorized' });

    const token = authHeader.split(' ')[1];
    const secret = process.env.SECRETE_KEY as string;

    try {
        const decoded: any = jwt.verify(token, secret);
        const userId = decoded.userId;
        const user = await userModal.findOne({ _id: userId });

        if (!user) return res.status(404).json({ message: 'User not found' });

        user.token = user.token.filter((t: string) => t !== token);
        await user.save();

        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.error('Error during logout:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
};

// --- CONFIRM EMAIL ---
export const confirmEmail = async (req: Request, res: Response) => {
    try {
        const { token } = req.params;
        if (!token) return res.status(400).json({ message: "Token is required" });

        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        const user = await userModal.findOne({
            confirmationToken: hashedToken,
            confirmationExpires: { $gt: Date.now() },
        });

        if (!user) return res.status(404).json({ message: 'Invalid or expired token' });

        user.isConfirmed = true;
        user.confirmationToken = undefined;
        user.confirmationExpires = undefined;
        await user.save();

        res.status(200).json({ message: 'Email confirmed successfully', user });
    } catch (error: any) {
        console.error('Error confirming email:', error);
        res.status(500).json({ message: 'Failed to confirm email', error: error.message });
    }
};
