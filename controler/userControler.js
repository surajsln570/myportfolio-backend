import e from 'express';
import {Projects} from '../modals/projects.js';
import { Signup } from "../modals/signup.js";
import {hash, compare} from 'bcryptjs'

export const getHomePage = (req, res, next) =>{
    console.log("Home page accessed");
 Projects.find().then((projects)=>{
    res.json({
        message: 'Projects fetched successfully',
        projects: projects
    });
}).catch((err)=>{
    console.log(err);
    res.status(500).json({
        message: 'Error fetching projects',
        error: err.message
    });
});

}

export const postSignup = async (req, res, next) => {
    const { firstName, lastName, mobile, email, password } = req.body;
    const hashedPassword = await hash(password, 10);
    const user = new Signup({
        firstName,  
        lastName,
        mobile,
        email,
        password:hashedPassword
    });
    user.save()
    .then((data) => {
        res.status(201).json({
            message: 'User signed up successfully', 
            user: data

        });
    })
    .catch(err => {
        res.status(500).json({
            message: 'Error signing up user',
            error: err.message
        });
    });
}

export const postLogin = async (req, res, next) => {
    const {email, password} = req.body;
    const verifyEmail = await Signup.findOne({email: email})
    if(verifyEmail){
        compare(password, verifyEmail.password).then((result)=>{
            if(result){
                req.session.user = verifyEmail;
                res.json({success: true, message: 'password verified'})
            }else{
                res.json({success: false, message: 'password doesnt match'})
            }
        })
    }
    else{
        res.json({message: "user doesn't exist "})
    }
}

export const getcheckAuth = async (req, res, next) => {
    if( req.session.user){
        res.json({loggedIn: true, user: req.session.user})
    }else{
        res.json({loggedIn: false})
    }
}

export const postLogout = async (req, res, next) => {
    console.log("postLout")
    req.session.destroy(()=> {
        res.clearCookie('connect.sid');
        res.json({success: true, message: 'Logged out'})
    })
}

