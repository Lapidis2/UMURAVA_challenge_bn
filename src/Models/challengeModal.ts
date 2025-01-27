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
        author:mongoose.Types.ObjectId,
        content:String,
         date  :Date
    }],
    createdAt: Date 
}

const blogSchema= new mongoose.Schema<blogModal>({
         title:{type:String},
         headline:{type:String},
         content:{type:String},
         imageUrl:{type:String},
         createdAt:{type:Date,default: Date.now()},
         likes:[{type:mongoose.Types.ObjectId,ref:"User"}],
    
        comment: [
            {
                  author:String,
                
                content: {type:String
                         
                     },
                created: { type: Date, default: Date.now },
                
              
            },
        ],
    },
    { timestamps: true 
    })
const blogModal=mongoose.model("blogs",blogSchema)
export default blogModal
