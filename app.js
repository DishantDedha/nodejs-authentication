import express, { urlencoded } from "express";
import connectToDatabase from "./config/connectDB.js";
import authRoutes from "./routes/authRoutes.js";
import cors from  "cors";
import path,{dirname} from "path";
import { fileURLToPath } from "url";
import session from "express-session";
import passport from "passport";
import './config/passport.js';
import dotenv from "dotenv";
import MongoStore from "connect-mongo";



dotenv.config();


const app= express();
app.use(cors());
const filename= fileURLToPath(import.meta.url)// converts teh file url into path
const _dirname= dirname(filename);// converts the path into directory


app.use(express.json()); // It looks at the Content-Type header of incoming requests. 
//If the content type is application/json, it parses the request body and makes it available in req.body.
//After parsing, any JSON data in the request body can be accessed via req.body.

app.use(express.urlencoded({extended:true}));//parses incoming requests with URL-encoded payloads, 
//which is often the format of form submissions in web applications.(HTML FORMS)

app.use(express.static(path.join(_dirname,'public')));// makes the server render static htm file.dirname+public folder is our path
app.use(session({
    secret: process.env.SESSION_SECRET, 
    resave: false,//SESSION will only be stored if it is modified
    saveUninitialized: true,//a session will be saved to the store even if it hasn't been modified. This is useful for tracking sessions that haven’t been modified yet (e.g., a user who has visited a page without logging in).
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI })// using mongo-connect//session automatically creates during authentication but dont
    // dont have any meaningfull info without explicitliy mentioning
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());



connectToDatabase();

app.use('/auth',authRoutes);
app.get('/' ,(req,res)=>{
    res.sendFile(path.join(_dirname,'public','signUp.html'));
});
app.get('/home' ,(req,res)=>{
    res.sendFile(path.join(_dirname,'public','home.html'));
});
app.get('/signin' ,(req,res)=>{
    res.sendFile(path.join(_dirname,'public','signIn.html'));
});

app.get('/reset-forgotten-password',(req,res)=>{
    res.sendFile(path.join(_dirname,'public','reset-forget-password.html'));
});
app.get('/setnewpassword',(req,res)=>{
    res.sendFile(path.join(_dirname,'public','setnewPassword.html'));
});
export default app;