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
        default:'talent'
    },
    token:[{type:String}],
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
      
    },
	timestamps:{
		type: Boolean,
	    default:true
	}
})
const userModal=mongoose.model("user",userSchema)
export default userModal;
