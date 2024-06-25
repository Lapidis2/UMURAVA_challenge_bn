import  express  from "express";
import { isAuthenticated,isAdmin } from "../middleWare/verifyToken";
import { createBlog } from "../Controllers/blogController";
import { uploadFile } from "../multer/multconfig";

const route =express.Router()
route.post('/createBlog',uploadFile,createBlog)

const blogRoutes=module.exports=route
export default blogRoutes