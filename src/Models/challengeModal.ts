import mongoose from "mongoose";
interface blogModal{
    title:String,
    deadline:String,
    duration:String,
    prize:String,
    contactEmail:String,
    projectDescription:String,
    projectBrief:String,
    projectTasks:String
}
const blogSchema= new mongoose.Schema<blogModal>({
	title: { type: String, required: true },
	deadline: { type: Date, required: true },
	duration: { type: String, required: true },
	prize: { type: String, required: true },
	contactEmail: { type: String, required: true },
	projectDescription: { type: String, required: true, maxlength: 250 },
	projectBrief: { type: String, required: true, maxlength: 50 },
	projectTasks: { type: String, required: true, maxlength: 500 },
    })
const blogModal=mongoose.model("blogs",blogSchema)
export default blogModal
