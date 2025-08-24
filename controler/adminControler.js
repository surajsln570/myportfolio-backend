import { Projects } from '../modals/projects.js';
import fs from 'fs'

export const getHomePage = (req, res, next) => {
    ///  
    const data = Projects.find();
    res.json(data);
}

export const postAddProjects = (req, res, next) => {
    console.log('req.file from adminControler: ', req.file);
    let imagePath = req.file.path.replace(/\\/g, '/')
    // Normalize the path for cross-platform compatibility
    const newImagePath = imagePath.replace('uploads/', '')

    const { projectName, projectDescription, projectUrl, projectStatus, projectTags, projectDate, projectType } = req.body;
    const newProject = new Projects({
        projectName,
        projectDescription,
        projectUrl,
        projectImage: newImagePath, // Assuming you are using multer for file uploads
        projectStatus,
        projectTags,
        projectDate,
        projectType
    });
    console.log('newProject from adminControler: ', newProject);


    newProject.save()
        .then(() => res.status(201).json({ message: 'Project created successfully' }))
        .catch(err => res.status(500).json({ error: err.message }));
}

export const deleteProjects = async (req, res, next) => {
    const { id } = req.params;
    const project = await Projects.findById(id)
    const projectImagePath = project.projectImage;
    if (project) {
        await project.deleteOne();
        fs.unlink(`uploads/${projectImagePath}`, (err) => console.log('error from adminControler', err))
        return res.status(200).json({ message: 'Project deleted successfully', id: id })
    } else {
        return res.status(500).json({ error: err.message })
    }
}

export const getaddProjects = async (req, res, next) => {
    const { id } = req.params;
    const project = await Projects.findById(id)
    if (project) {
        return res.json(project)
    } else {
        return res.status(500).json({ error: 'project not found' })
    }
}

export const updateProjects = (req, res, next) => {
    const { id } = req.params;
    const { projectName, projectDescription, projectUrl, projectStatus, projectTags, projectDate, projectType, projectImage } = req.body;
    Projects.findByIdAndUpdate(id, {
        projectName,
        projectDescription,
        projectUrl,
        projectImage,
        projectTags,
        projectDate,
        projectType
    }, { new: true })
        .then(updatedProject => res.status(200).json(updatedProject))
        .catch(err => res.status(500).json({ error: err.message }));
}

export const getProject= async (req, res, next)=>{
    const {id} = req.params;
    const project = await Projects.findById(id)
    res.json(project);
}

export const putProject = async (req, res, next) => {
        let imagePath = req.file.path.replace(/\\/g, '/')
    // Normalize the path for cross-platform compatibility
    const newImagePath = imagePath.replace('uploads/', '')
    const body = req.body
    const {id} = req.params;
    const project = await Projects.findById(id);
    if (project) {
        fs.unlink(`uploads/${project.projectImage}`, (err) => console.log('error from adminControler', err))
    }
    if(body){
        body.projectImage = newImagePath
    }
    const updatedProject = await Projects.findByIdAndUpdate(id, body, {new: true})
    
    res.json(updatedProject);
}