import  express  from "express";
import { isAuthenticated,isAdmin } from "../middleWare/verifyToken";
import { createBlog,getBlogs,getSingleBlog,updateBlog,deleteBlog, addLike,addComment } from "../Controllers/blogController";

const route =express.Router()
route.post('/createBlog',createBlog)
route.get('/getBlogs',isAdmin,getBlogs)
route.get('/getSingleBlog/:id',getSingleBlog)
route.put('/updateBlog/:id',updateBlog)
route.delete('/deleteBlog/:id',deleteBlog)
route.post('/addLike/:blogId',isAuthenticated,addLike)
route.post('/addComment/:blogId',isAuthenticated,addComment)
const blogRoutes=module.exports=route
export default blogRoutes