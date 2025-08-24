import express from 'express';
import {userRouter} from './routes/userRouter.js';
import {adminRouter} from './routes/adminRouter.js';
import mongoose from 'mongoose';
import cors from 'cors';
import multer from 'multer';
import session from 'express-session';


const app = express();
const DB_PATH = "mongodb+srv://surajsln570:surajsln570@surajsln.ax3ckws.mongodb.net/myweb?retryWrites=true&w=majority&appName=surajsln"

const PORT = 3000;
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const multerOptions = {
    storage: storage,
    fileFilter: fileFilter
}

//calling middleware}
app.use(cors(
    {origin: "http://localhost:5173", // frontend url
        credentials: true,   //allow cookies
    }
));
app.use(express.json());
app.use(session({
    secret: 'mySecretKey',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 1000*60*60*24 //this is a day duration
    }
}))
app.use(express.static('uploads')); // for serving static files from 'uploads' directory
app.use(express.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded
app.use(multer(multerOptions).single('projectImage'));// for parsing multipart/form-data
app.use(userRouter);
app.use('/admin', adminRouter);


//listion to request
mongoose.connect(DB_PATH).then(
app.listen(PORT, ()=>{
    console.log(`server is running on https://localhost:${PORT}`)
})
)
