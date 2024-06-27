import mongoose, { mongo } from "mongoose";

interface userModal{
    id:String
    userName:String,
    email:String,
    password:string,
    role:String,
    confirmationToken:String,
    isConfirmed: Boolean,
    resetPasswordToken: String,
    resetPasswordExpire: Date
    token:String[]
    createdAt:Date

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
        default:'Guest'||'Admin'
    },
    token:[{type:String}],
    createdAt:{
        type:Date,
        default: Date.now
    },
    
    isConfirmed:{
     type: Boolean,
     default:false
    },
    confirmationToken:{
        type:String
    } ,
    resetPasswordToken: {
        type:String
      
    },
    resetPasswordExpire: {
        type:Number
      
    }
})
const userModal=mongoose.model("user",userSchema)
export default userModal;