import  express  from "express";
import { isAuthenticated,isAdmin } from "../middleWare/verifyToken";
import { createBlog,getBlogs,getSingleBlog,updateBlog,deleteBlog } from "../Controllers/challengeController";
const route =express.Router()
import { upload } from "../Controllers/challengeController";
/**
 * @swagger
 * /api/createChallenge:
 *   post:
 *     summary: Create a new challenge with an image upload (requires authentication)
 *     description: Allows authenticated users to create a challenge with an image upload.
 *     tags:
 *       - Challenges
 *     security:
 *       - BearerAuth: []  # Requires a Bearer token for authentication
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *               - title
 *               - duration
 *               - date
 *               - prize
 *               - projectBrief
 *               - projectDescription
 *               - projectTasks
 *               - contact
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: The image file to be uploaded for the challenge
 *               title:
 *                 type: string
 *                 description: The title of the challenge
 *                 example: "UI/UX Dashboard Design Challenge"
 *               duration:
 *                 type: string
 *                 description: Duration of the challenge
 *                 example: "15 Days"
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: The creation date of the challenge
 *                 example: "2025-03-08T12:00:00Z"
 *               prize:
 *                 type: string
 *                 description: Prize for the challenge winner
 *                 example: "$500 cash reward"
 *               projectBrief:
 *                 type: string
 *                 description: A brief summary of the project
 *                 example: "Create an interactive and user-friendly dashboard for SokoFund."
 *               projectDescription:
 *                 type: string
 *                 description: Detailed description of the challenge
 *                 example: "Participants need to design a web dashboard with responsive layouts and seamless user experience."
 *               projectTasks:
 *                 type: array
 *                 description: List of tasks required for the challenge
 *                 items:
 *                   type: string
 *                 example: ["Design wireframes", "Create UI components", "Develop front-end"]
 *               contact:
 *                 type: string
 *                 description: Contact information for the challenge
 *                 example: "challenge@umurava.com"
 *     responses:
 *       201:
 *         description: Challenge created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Challenge created successfully"
 *                 challenge:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "64a2f45b4d5f3a001c9b0d1e"
 *                     title:
 *                       type: string
 *                       example: "UI/UX Dashboard Design Challenge"
 *                     duration:
 *                       type: string
 *                       example: "15 Days"
 *                     date:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-03-08T12:00:00Z"
 *                     imageUrl:
 *                       type: string
 *                       example: "https://example.com/uploads/challenge-image.jpg"
 *       400:
 *         description: Bad request (missing or invalid fields)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid input data"
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
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server error, failed to create challenge."
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

route.post('/createBlog',upload,createBlog)
/**
 * @swagger
 * /api/getBlogs:
 *   get:
 *     summary: Retrieve all blog posts (requires authentication)
 *     description: Fetch a list of all the blog posts available. This endpoint requires a valid token to be accessed.
 *     tags:
 *       - Challenges
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
 *       - Challenges
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

route.get('/getSingleBlog/:id',getSingleBlog)
/**
 * @swagger
 * /api/updateblog/{id}:
 *   put:
 *     summary: Update an existing blog post
 *     description: Update an existing blog post with new content, title, headline, or imageUrl.
 *     tags:
 *       - Challenges
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
 *       - Challenges
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
const blogRoutes=module.exports=route
export default blogRoutes