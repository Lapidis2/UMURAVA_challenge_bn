import mongoose from "mongoose";


interface blogModal{
    title:String,
    headline:String,
    content:String,
    imageUrl:String,
    views:[],
    likes:[],
    shares:[],
    comment:[{
        author:String,
        content:String,
         date  :Date
    }],
    createdAt: Date 
}

const blogSchema= new mongoose.Schema({
         title:{type:String},
         headline:{type:String},
         content:{type:String},
         imageUrl:{type:String},
         createdAt:{type:Date,default: Date.now()},
         views:[{type:mongoose.Types.ObjectId,ref:"User"}],
         likes:[{type:mongoose.Types.ObjectId,ref:"User"}],
         shares:[{type:mongoose.Types.ObjectId,ref:"User"}],
         comment:[{
            author:{type:String},
            date:{
                type: Date,
                default: Date.now()
            }
         }],

})
const blogModal=mongoose.model("blogs",blogSchema)
export default blogModal
