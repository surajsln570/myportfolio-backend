import { Projects } from '../modals/projects.js';
import { Signup } from "../modals/signup.js";
import { hash, compare } from 'bcryptjs'

export const getHomePage = (req, res, next) => {
    Projects.find().then((projects) => {
        res.json({
            message: 'Projects fetched successfully',
            projects: projects
        });
    }).catch((err) => {
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
        password: hashedPassword
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
    try {
        const { email, password } = req.body;
        const verifyEmail = await Signup.findOne({ email: email })
        if (!verifyEmail) {
            return res.json({ message: "user doesn't exist " })
        }
        const result = await compare(password, verifyEmail.password)
        if (!result) {
            return res.json({ success: false, message: 'password doesnt match' })
        }
        req.session.userId = verifyEmail._id;
        await req.session.save();
        return res.json({ success: true, message: 'Loggedin Successfully' })
    }
    catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message })
    }
}

export const getcheckAuth = async (req, res, next) => {
    try {
        if (!req.session.userId) {
            return res.json({ loggedIn: false, message: 'Cant find userId in session' })
        }
        const user = await Signup.findById(req.session.userId)
        if (!user) {
            return res.json({ loggedIn: false, message: 'user does not exist' })
        }
        return res.json({ loggedIn: true, user })
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message })
    }
}

export const postLogout = async (req, res, next) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({success: false, message: "Logout failed"});
        }
        res.clearCookie("connect.sid", {
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });
        return res.status(200).json({ success: true, message: "Logged out"});
    });
};

