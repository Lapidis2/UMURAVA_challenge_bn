import mongoose from "mongoose";
interface  messageModal{
    username:string,
    email:string; 
    message:string,
    createdAt:Date
}



const messsageSchema=new mongoose.Schema<messageModal>({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    },
    createdAt: {
        type: Date,
        default: Date.now
      }
    
})
const messageModal=mongoose.model("message",messsageSchema)
export default messageModal