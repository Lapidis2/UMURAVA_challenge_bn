import express from "express"
import {createMessage,deleteMessage,getMessage, replyMessage} from "../Controllers/messageController"
import { isAuthenticated,isAdmin } from "../middleWare/verifyToken";
const route= express.Router()

/**
 * @swagger
 * /api/createMessage:
 *   post:
 *     summary: Create a new message
 *     description: This endpoint allows users to create a new message by providing a username, email, and userMessage.
 *     tags:
 *       - Messages
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username who send message
 *                 example: "Eric jackson"
 *               email:
 *                 type: string
 *                 description: The email of sender
 *                 example: "eric@gmail.com"
 *               message:
 *                 type: string
 *                 description: The conent of the sendermessage
 *                 example: "Just a quick reminder about the meeting scheduled for tomorrow at 10 AM."
 *     responses:
 *       201:
 *         description: Message created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Message created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: string
 *                       example: "Eric"
 *                     email:
 *                       type: string
 *                       example: "eric@gmail.com"
 *                     message:
 *                       type: string
 *                       example: "Just a quick reminder about the meeting scheduled for tomorrow at 10 AM."
 *       400:
 *         description: Bad request (missing required fields)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "All fields (subject, content, senderEmail) are required."
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
route.post("/createMessage",createMessage);
/**
 * @swagger
 * /api/replyMessage:
 *   post:
 *     summary: Reply to a message
 *     description: This endpoint sends a reply to a user via email. Requires authentication and optionally admin privileges.
 *     tags:
 *       - Messages
 *     security:
 *       - BearerAuth: []  # This indicates that the endpoint requires a Bearer token for authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email address to send the reply to
 *                 example: "user@example.com"
 *               replyMessage:
 *                 type: string
 *                 description: The message content of the reply
 *                 example: "Thank you for your message! We'll get back to you soon."
 *     responses:
 *       201:
 *         description: Reply sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Reply sent successfully!"
 *       400:
 *         description: Bad request (missing required fields)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Email and replyMessage are required"
 *       401:
 *         description: Unauthorized (invalid or missing token)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized. Please provide a valid token."
 *       403:
 *         description: Forbidden (insufficient permissions)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Access denied. This route is for Admin only."
 *       500:
 *         description: Failed to send the email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to send reply email."
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

route.post("/replyMessage",isAuthenticated,isAdmin,replyMessage)
/**
 * @swagger
 * /api/getMessage:
 *   get:
 *     summary: Retrieve all messages (requires authentication)
 *     description: Fetch a list of all messages available. This endpoint requires a valid token to be accessed.
 *     tags:
 *       - Messages
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all messages
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The unique identifier for message
 *                   username:
 *                     type: string
 *                     description: The sender'username
 *                   email:
 *                     type: string
 *                     description: The email of the sender
 *                   message:
 *                     type: string
 *                     description: The main content of the message post
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: The timestamp when the message was created
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     description: The timestamp when the message was last updated
 *       401:
 *         description: Unauthorized (invalid or missing token)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized. Please provide a valid token."
 *       404:
 *         description: No messages found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No messages available"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server error, failed to fetch messages."
 *   components:
 *     securitySchemes:
 *       BearerAuth:
 *         type: http
 *         scheme: bearer
 *         bearerFormat: JWT
 */
route.get("/getMessage",isAuthenticated,isAdmin,getMessage)
/**
 * @swagger
 * /api/deleteMessage/{id}:
 *   delete:
 *     summary: Delete a single message by ID (requires authentication and admin role)
 *     description: Delete a message by its unique ID. This endpoint requires a valid token and the user must be an admin.
 *     tags:
 *       - Messages
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique ID of the message to delete
 *         schema:
 *           type: string
 *     security:
 *       - BearerAuth: []  
 *     responses:
 *       200:
 *         description: message deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "message deleted successfully"
 *       401:
 *         description: Unauthorized (invalid or missing token)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized. Please provide a valid token."
 *       404:
 *         description: message not found (invalid ID)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "message not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server error, failed to delete message."
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

route.delete("/deleteMessage/:messageId",isAuthenticated,isAdmin,deleteMessage)
const messageRoutes=module.exports=route;
export default messageRoutes;
