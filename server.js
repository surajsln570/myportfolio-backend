import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { userRouter } from './routes/userRouter.js';
import { adminRouter } from './routes/adminRouter.js';
import mongoose from 'mongoose';
import cors from 'cors';
import session from 'express-session';


const app = express();

//calling middleware}
const allowedOrigins = [
    'https://myportfolio-fronted.vercel.app',
    'http://localhost:5173'
];

app.use(cors(
    {
        origin: allowedOrigins,
        credentials: true,
    }
));
app.use(express.json());
app.set('trust proxy', 1);
app.use(session({
    secret: 'mySecretKey',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 1000 * 60 * 60 * 24, //this is a day duration
        path: "/"
    }
}))



app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(userRouter);
app.use('/admin', adminRouter);

const mongoUri = process.env.MONGO_URI
console.log('mongoUri', mongoUri);
const port = process.env.PORT
mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('mongodb connected'))
  .catch((err) => {
    console.log("mongoDB connection error", err)
})

//listion to request
app.listen(port, () => {
    console.log(`server is running on ${port}`)
})