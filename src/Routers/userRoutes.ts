import express, { Router } from "express";
import { registerUser,confirmEmail,loginUser,logout,getAllUser,getSingleUser,deleteUser,updateUser,requestPasswordReset,resetPassword } from "../Controllers/userController";
import { isAdmin, isAuthenticated } from "../middleWare/verifyToken";
const route=express.Router()

route.post('/registerUser',registerUser)
route.put('/confirmEmail/:token',confirmEmail)
route.post('/login',loginUser)
route.get('/getAllUser',isAuthenticated,isAdmin,getAllUser)
route.get('/getSingleUser/:userId',isAuthenticated,isAdmin,getSingleUser)
route.put('/updateUser/:userId',isAuthenticated,updateUser)
route.delete('/deleteUser/:userId',isAuthenticated,isAdmin,deleteUser)
route.post('/requestToken',requestPasswordReset)
route.put('/resetPassword/:token',resetPassword)
route.post('/logout',isAuthenticated,logout)
const userRoutes=module.exports=route
export default userRoutes;