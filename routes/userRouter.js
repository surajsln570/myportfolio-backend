//this is exteral module;
import express from 'express';
//these are local modules;
import {getHomePage, postLogin, postSignup, getcheckAuth, postLogout} from '../controler/userControler.js'
const app = express();


export const userRouter = express.Router();

userRouter.get('/', getHomePage);
userRouter.post('/signup', postSignup);
userRouter.post('/login', postLogin);
userRouter.get('/checkauth', getcheckAuth)
userRouter.post('/logout', postLogout);

