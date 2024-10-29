import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import User from "../models/userModel.js";


dotenv.config();

// passport.use tells passport to use specific start
passport.use(new GoogleStrategy({
    //Configuration object
    clientID:process.env.CLIENT_ID,//unique identifier provided by google(when setting up oauth credentials in the google developer console) , 
                                    //tells google which app is requesting

    clientSecret:process.env.CLIENT_SECRET,//secret key used to authenticate application to google servers

    callbackURL:'https://nodejs-authentication-2rtn.onrender.com/auth/google/callback'// the url where google will redirect after the authentication

},async(accessToken, refreshToken, profile, done)=>{// async callback function, is called after user successfully authenticate
    try{                                                //accesstoken grants access to the users data on google.// refreshToken used to get new access token
           const existingUser= await User.findOne({googleId: profile.id});// however this doesnot take care if user used his email via others method
            // so ({ email: profile.emails[0].value });  might be a good idea
                    if(existingUser)                                       // profile is object containing users data
                        {
                          return done(null,existingUser);
                        }  // done is callback used to call to indicate completion of authentication
                        // its in the form done(error,user,info), if no error then null, ifo is optional 
                 const newUser= new User({
                    
                    email:profile.emails[0].value,
                    password:"defaultPassword",
                    googleId:profile.id,

                 });
                 await newUser.save();
                 done(null,newUser);                                  
    }
    catch(error)
    {
         done(error,null);
    }                                            
}
));
 
// serailzeuser function  tells ehat data should be stored in session after authentication
 passport.serializeUser((user,done)=>{
    done(null,user.id);
 });

 // deserilazeuser function retrives the full user object on subsequent requests
 passport.deserializeUser(async (id,done)=>{
    const user= await User.findById(id);
    done(null,user);
 });