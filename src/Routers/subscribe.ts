import express from "express";
import { Subscribe } from "../Controllers/subscribe";

const route = express.Router();

route.post('/Subscribe', Subscribe);
const subscribeRoute = (module.exports) = route;
export default subscribeRoute;