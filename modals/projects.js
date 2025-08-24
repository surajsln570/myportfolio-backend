import mongoose from "mongoose";  

const projectsSchema = mongoose.Schema({
    projectName: {
        type: String,
        required: true
    },
    projectDescription: {
        type: String,
    },
    projectUrl: {
        type: String,
        required: true
    },
    projectImage: {
        type: String,
        required: true
    },
    projectTags: {
        type: String,
    },
    projectStatus: {
        type: String,
        enum: ['active', 'completed', 'archived'],
        default: 'active'
    },
    projectDate: {
        type: Date,
        default: Date.now
    },
    projectType: {
        type: String,
    },
});
export const Projects = mongoose.model('Projects', projectsSchema);