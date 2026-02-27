import { Projects } from '../modals/projects.js';
import fs from 'fs'

export const getHomePage = async (req, res, next) => {
    ///  
    try {
        const data = await Projects.find();
        return res.status(200).json(data);
    } catch (error) {
        console.log('error from getHomePage',error);
        return res.status(500).json({success: false, message: error.message})
    }
}

export const postAddProjects = async(req, res, next) => {
    let newImagePath = req.file.path;

    const { projectName, projectDescription, projectUrl, projectStatus, projectDate, projectType } = req.body;
    const projectTags = await JSON.parse(req.body.projectTags);
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

export const updateProjects = async(req, res, next) => {
    console.log('updateProjects')
    const { id } = req.params;
    const projectImage = req.file.path;
    const { projectName, projectDescription, projectUrl, projectStatus, projectDate, projectType} = req.body;
    const projectTags = await JSON.parse(req.body.projectTags);
    Projects.findByIdAndUpdate(id, {
        projectName,
        projectDescription,
        projectUrl,
        projectImage,
        projectTags,
        projectDate,
        projectType,
        projectStatus
    }, { new: true })
        .then(updatedProject => res.status(200).json(updatedProject))
        .catch(err => res.status(500).json({ error: err.message }));
}

export const getProject = async (req, res, next) => {
    const { id } = req.params;
    const project = await Projects.findById(id)
    res.json(project);
}

export const putProject = async (req, res, next) => {
    try {
        const body = req.body
        const { id } = req.params;
        const project = await Projects.findById(id);

        if (!req.file) {
            body.projectImage = project.projectImage;
        } else {
            if (project) {
                fs.unlink(`uploads/${project.projectImage}`, (err) => {if(err){console.log('error from adminControler', err)}})
            }
            let imagePath = req.file.path.replace(/\\/g, '/')
            const newImagePath = imagePath.replace('uploads/', '')
            if (body) {
                body.projectImage = newImagePath
            }
        }
        const updatedProject = await Projects.findByIdAndUpdate(id, body, { new: true })

        return res.json(updatedProject);

    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, error })
    }
}