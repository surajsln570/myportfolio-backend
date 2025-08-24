import express from 'express';
import {userRouter} from './routes/userRouter.js';
import {adminRouter} from './routes/adminRouter.js';
import mongoose from 'mongoose';
import cors from 'cors';
import multer from 'multer';
import session from 'express-session';
import dotenv from 'dotenv';


const app = express();
dotenv.config();

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
    {origin: "https://myportfolio-backend-zxqb.onrender.com",
         // frontend url
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


const port = process.env.PORT
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=> console.log('mongodb connected'))
.catch((err)=>{
    console("mongoDB connection error", err)
})

//listion to request
app.listen(port, ()=>{
    console.log(`server is running on ${port}`)
})
