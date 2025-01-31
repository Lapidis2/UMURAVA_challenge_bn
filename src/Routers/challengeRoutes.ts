import  express  from "express";
import { isAuthenticated,isAdmin } from "../middleWare/verifyToken";
import { createBlog,getBlogs,getSingleBlog,updateBlog,deleteBlog, addLike,addComment } from "../Controllers/challengeController";

const route =express.Router()

/**
 * @swagger
 * /api/Createblog:
 *   post:
 *     summary: Create a new blog post
 *     description: Creates a new blog post with a title, headline, content, and imageUrl.
 *     tags:
 *       - Blogs
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the blog post
 *                 example: "My journey in learning coding!"
 *               headline:
 *                 type: string
 *                 description: The short story of the blog post
 *                 example: "It was not easy to start learning coding for me but....."
 *               content:
 *                 type: string
 *                 description: The main content of the blog post
 *                 example: "It was not easy to start learning coding for me but....."
 *               imageUrl:
 *                 type: string
 *                 format: binary
 *                 description: The image to be uploaded for the blog post.
 *     responses:
 *       201:
 *         description: Blog post created successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */

route.post('/createBlog',createBlog)
/**
 * @swagger
 * /api/getBlogs:
 *   get:
 *     summary: Retrieve all blog posts (requires authentication)
 *     description: Fetch a list of all the blog posts available. This endpoint requires a valid token to be accessed.
 *     tags:
 *       - Blogs
 *     security:
 *       - BearerAuth: []  # This indicates that the endpoint requires a Bearer token for authentication
 *     responses:
 *       200:
 *         description: A list of all blog posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The unique identifier for the blog post
 *                   title:
 *                     type: string
 *                     description: The title of the blog post
 *                   headline:
 *                     type: string
 *                     description: The short story or summary of the blog post
 *                   content:
 *                     type: string
 *                     description: The main content of the blog post
 *                   imageUrl:
 *                     type: string
 *                     description: The URL to the image related to the blog post
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: The timestamp when the blog was created
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     description: The timestamp when the blog was last updated
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
 *         description: No blogs found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No blogs available"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server error, failed to fetch blogs."
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

route.get('/getBlogs',isAuthenticated,isAdmin,getBlogs)
/**
 * @swagger
 * /api/getSingleBlog/{id}:
 *   get:
 *     summary: Retrieve a single blog post by ID (requires authentication)
 *     description: Fetch a single blog post by its unique ID. This endpoint requires a valid token for authentication.
 *     tags:
 *       - Blogs
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique ID of the blog post to retrieve
 *         schema:
 *           type: string
 *     security:
 *       - BearerAuth: []  # This indicates that the endpoint requires a Bearer token for authentication
 *     responses:
 *       200:
 *         description: A single blog post
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Blog found"
 *                 blog:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: The unique identifier for the blog post
 *                     title:
 *                       type: string
 *                       description: The title of the blog post
 *                     headline:
 *                       type: string
 *                       description: The short story or summary of the blog post
 *                     content:
 *                       type: string
 *                       description: The main content of the blog post
 *                     imageUrl:
 *                       type: string
 *                       description: The URL to the image related to the blog post
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: The timestamp when the blog was created
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       description: The timestamp when the blog was last updated
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
 *         description: Blog not found (invalid ID)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Blog not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server error, failed to fetch blog."
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

route.get('/getSingleBlog/:id',isAuthenticated,isAdmin,getSingleBlog)
/**
 * @swagger
 * /api/updateblog/{id}:
 *   put:
 *     summary: Update an existing blog post
 *     description: Update an existing blog post with new content, title, headline, or imageUrl.
 *     tags:
 *       - Blogs
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the blog post to be updated
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the blog post
 *                 example: "My updated journey in learning coding!"
 *               headline:
 *                 type: string
 *                 description: The short story of the blog post
 *                 example: "It was difficult, but I finally figured out how to code!"
 *               content:
 *                 type: string
 *                 description: The main content of the blog post
 *                 example: "I went through many obstacles before I could understand coding!"
 *               imageUrl:
 *                 type: string
 *                 format: binary
 *                 description: The image to be uploaded for the updated blog post.
 *     responses:
 *       200:
 *         description: Blog post updated successfully
 *       400:
 *         description:  missing required fields
 *       404:
 *         description: Blog post not found 
 *       500:
 *         description: Internal server error
 */
route.put('/updateBlog/:id',updateBlog)
/**
 * @swagger
 * /api/deleteBlog/{id}:
 *   delete:
 *     summary: Delete a single blog post by ID (requires authentication and admin role)
 *     description: Delete a blog post by its unique ID. This endpoint requires a valid token and the user must be an admin.
 *     tags:
 *       - Blogs
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique ID of the blog post to delete
 *         schema:
 *           type: string
 *     security:
 *       - BearerAuth: []  # This indicates that the endpoint requires a Bearer token for authentication
 *     responses:
 *       200:
 *         description: Blog post deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Blog deleted successfully"
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
 *         description: Blog not found (invalid ID)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Blog not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server error, failed to delete blog."
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

route.delete('/deleteBlog/:id',deleteBlog)
route.post('/addLike/:blogId',isAuthenticated,addLike)
route.post('/addComment/:blogId',isAuthenticated,addComment)
const blogRoutes=module.exports=route
export default blogRoutes