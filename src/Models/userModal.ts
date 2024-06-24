import mongoose, { mongo } from "mongoose";

interface userModal{
    userName:String,
    email:String,
    password:string,
    role:String,
    createdAt:Date
    resetPasswordToken: String,
    resetPasswordExpire: Date
}

const userSchema=new mongoose.Schema({
    userName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        default:'Guest'
    },
    createdAt:{
        type:Date,
        default: Date.now
    },

    resetPasswordToken: {
        type:String
      
    },
    resetPasswordExpire: {
        type:Number
      
    }
})
const userModal=mongoose.model("user",userSchema)
export default userModal;