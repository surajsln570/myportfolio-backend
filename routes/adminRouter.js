//this is exteral module;
import express from 'express';
//these are local modules;
import {getHomePage, postAddProjects, deleteProjects, getaddProjects, getProject, putProject} from '../controler/adminControler.js'
import { upload } from '../config/multer.js';


export const adminRouter = express.Router();

adminRouter.get('/', getHomePage)
adminRouter.post('/add-projects', upload.single("projectImage"),  postAddProjects);
adminRouter.delete('/add-projects/:id', deleteProjects);
adminRouter.get('/add-projects/:id', getaddProjects);
adminRouter.get('/project/:id', getProject)
adminRouter.put('/update/:id', upload.single("projectImage"), putProject)
