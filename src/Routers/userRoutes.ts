import express, { Router } from "express";
import { registerUser,confirmEmail,loginUser,getAllUser,getSingleUser,deleteUser,updateUser,requestPasswordReset,resetPassword } from "../Controllers/userController";
const route=express.Router()

route.post('/registerUser',registerUser)
route.put('/confirmEmail/:token',confirmEmail)
route.post('/login',loginUser)
route.get('/getAllUser',getAllUser)
route.get('/getSingleUser/:userId',getSingleUser)
route.put('/updateUser/:userId',updateUser)
route.delete('/deleteUser/:userId',deleteUser)
route.post('/requestToken',requestPasswordReset)
route.put('/resetPassword/:token',resetPassword)
const userRoutes=module.exports=route
export default userRoutes;