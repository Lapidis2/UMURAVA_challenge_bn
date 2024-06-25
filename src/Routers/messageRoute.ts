import express from "express"
import {createMessage,deleteMessage,getMessage, replyMessage} from "../Controllers/messageController"
import { isAuthenticated,isAdmin } from "../middleWare/verifyToken";
const route= express.Router()


route.post("/createMessage",isAuthenticated,createMessage);
route.post("/replyMessage",isAuthenticated,isAdmin,replyMessage)
route.get("/getMessage",isAuthenticated,isAdmin,getMessage)
route.delete("/deleteMessage/:userId",isAuthenticated,isAdmin,deleteMessage)
const messageRoutes=module.exports=route;
export default messageRoutes
