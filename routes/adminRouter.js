//this is exteral module;
import express from 'express';
//these are local modules;
import {getHomePage, postAddProjects, deleteProjects, getaddProjects, getProject, putProject} from '../controler/adminControler.js'


export const adminRouter = express.Router();

adminRouter.get('/', getHomePage)
adminRouter.post('/add-projects', postAddProjects);
adminRouter.delete('/add-projects/:id', deleteProjects);
adminRouter.get('/add-projects/:id', getaddProjects);
adminRouter.get('/project/:id', getProject)
adminRouter.put('/update/:id', putProject)
