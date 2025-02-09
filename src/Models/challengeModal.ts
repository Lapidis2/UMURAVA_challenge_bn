import mongoose from "mongoose";


interface blogModal{
    title:String,
    headline:String,
    content:String,
    createdAt: Date 
}

const blogSchema= new mongoose.Schema<blogModal>({
         title:{type:String},
         headline:{type:String},
         content:{type:String},
         createdAt:{type:Date,default: Date.now()},
         
    },
    { timestamps: true 
    })
const blogModal=mongoose.model("blogs",blogSchema)
export default blogModal
