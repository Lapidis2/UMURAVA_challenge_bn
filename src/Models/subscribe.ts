import mongoose from "mongoose";

interface subscribeModal{
    email:String,
    createdAt:Date
}

const subscribeSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    createdAt: {
        type: Date,
        default: Date.now
      }
})
const subscribeModal=mongoose.model("subscribe",subscribeSchema)
export default subscribeModal