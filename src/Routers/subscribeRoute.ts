import express from "express";
import { Subscribe,deleteSub,NotifySubscribers} from "../Controllers/subscribeController";
import { isAuthenticated } from "../middleWare/verifyToken";

const route = express.Router();
/**
 * @swagger
 * /api/subscribe:
 *   post:
 *     summary: Adding subscription email
 *     description: Adds the user's email to the subscription list.
 *     tags:
 *       - Subscriptions
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *     responses:
 *       201:
 *         description: Successfully subscribed to our channel
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Thank you for subscribing to our channel."
 *       400:
 *         description: Bad request (email is missing)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Email is required."
 *       409:
 *         description: Conflicting error (email already subscribed)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "The email has already been subscribed."
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server error, failed to subscribe."
 */
route.post("/subscribe",Subscribe);
/**
 * @swagger
 * /api/unsubscribe:
 *   delete:
 *     summary: Removing your subscription email
 *     description: Removes a user from the subscription list based on the provided email.
 *     tags:
 *       - Subscriptions
 *     parameters:
 *       - name: email
 *         in: query
 *         description: The email address to unsubscribe
 *         required: true
 *         schema:
 *           type: string
 *           example: "user@example.com"
 *     responses:
 *       200:
 *         description: Successfully unsubscribed from our channel
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "You have been unsubscribed successfully."
 *       400:
 *         description: Bad request (email is missing)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Email is required."
 *       404:
 *         description: Subscription not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Subscription email not found on list."
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server error, failed to remove email."
 */
route.delete("/unsubscribe",deleteSub);
route.post("/notfySub",NotifySubscribers);
const subscribeRoute = (module.exports) = route;
export default subscribeRoute;