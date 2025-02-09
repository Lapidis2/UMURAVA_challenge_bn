import mongoose from "mongoose";


interface blogModal{
    title:String,
    skills:String,
    seniority:String,
    status: String,
    timeline:String
}

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    skills: { type: [String], required: true },
    seniority: { type: String, required: true },
    timeline: { type: String },
    status: { type: String },
  },
  {
    timestamps: true,
  }
);

const blogModal=mongoose.model("blogs",blogSchema)
export default blogModal
