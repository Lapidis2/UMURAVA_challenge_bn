import mongoose, { mongo } from "mongoose";

interface userModal{
    id:String
    username:String,
    email:String,
	firstname:String,
	lastname:String,
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
    username:{
        type:String,
        required:true
    },
	 firstname:{
        type:String,
        required:false
    },
	 lastname:{
        type:String,
        required:false
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
        default:'guest'
    },
    token:[{type:String}],
    isConfirmed:{
     type: Boolean,
     default:true
    },
	confirmationExpires: { type: Date },
	
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
