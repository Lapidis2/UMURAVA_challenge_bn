import express from "express";
import { Subscribe } from "../Controllers/subscribeController";
import { isAuthenticated } from "../middleWare/verifyToken";

const route = express.Router();

route.post('/Subscribe',isAuthenticated, Subscribe);
const subscribeRoute = (module.exports) = route;
export default subscribeRoute;