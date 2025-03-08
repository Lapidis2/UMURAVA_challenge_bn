import mongoose from "mongoose";
interface blogModal{
    title:String,
    date:String,
    duration:String,
    prize:String,
    contact:String,
    projectDescription:String,
    projectBrief:String,
    projectTasks:String
	imageUrl:String
}
const blogSchema= new mongoose.Schema<blogModal>({
	imageUrl:{type:String},
	title: { type: String, required: true },
	date: { type: Date, required: true },
	duration: { type: String, required: true },
	prize: { type: String, required: true },
	contact: { type: String, required: true },
	projectDescription: { type: String, required: true, maxlength: 500 },
	projectBrief: { type: String, required: true, maxlength: 500 },
	projectTasks: { type: String, required: true, maxlength: 500 },
    })
const blogModal=mongoose.model("blogs",blogSchema)
export default blogModal
