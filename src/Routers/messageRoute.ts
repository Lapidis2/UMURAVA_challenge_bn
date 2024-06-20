import express from "express"
import {createMessage,getMessage, replyMessage} from "../Controllers/messageController"
const route= express.Router()


route.post("/createMessage",createMessage);
route.post("/replyMessage",replyMessage)
route.get("/getMessage",getMessage)

const messageRoutes=module.exports=route;
export default messageRoutes
