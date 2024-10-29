import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { verifyRecaptcha } from "../config/verifyRecaptcha.js";
import passport from "passport";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";


dotenv.config();


// signup
export const signUp= async(req,res)=>{
    const {email,password,confirmPassword,recaptchaResponse}=req.body;

    if(password !==confirmPassword)
    {
         return res.status(400).json({message:'passwords donot match brother.'});
    }
    try{
        const recaptchaValid = await verifyRecaptcha(recaptchaResponse);
        if (!recaptchaValid) {
          return res.status(400).json({ message: 'Invalid reCAPTCHA' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists.' });
        }

        const newUser= new User({email,password});
        await newUser.save();
        res.status(201).json({message:'user Created successfully'});
    }
    catch(error)
    {
        res.status(500).json({messsage:"not able to create User"})
    }

}
// signin
export const signIn= async(req,res)=>{
    const {email,password,recaptchaResponse}=req.body;
    try{

        const recaptchaValid = await verifyRecaptcha(recaptchaResponse);
        if (!recaptchaValid) {
          return res.status(400).json({ message: 'Invalid reCAPTCHA' });
        }
        const user= User.findOne({email});
        // checking credentials
        if(!user ||(await user.comparePassword(password)))
        {
            res.status(401).json({message:"invalid credentials."});
        }
        // creating jwt token

        const token= jwt.sign({id:user_id},process.env.JWT_SECRET,{expiresIn:'1h'});
        if(!token)
        {
            res.status(401).json({message:"no token"});
        }
        res.status(200).json({token});

        // Google signin
        if(req.user)
        {
            // if user already authenticated via google
            const token= jwt.sign({id:req.user._id},process.env.JWT_SECRET,{expiresIn:'1h'});
            if(!token)
                {
                    res.status(401).json({message:"no token"});
                }
                res.status(200).json({token});
        
        }

    } catch(error)
    {
        res.status(500).json({message:"not able to sign in."});
    }

}
// Google Auth Callback
export const googleCallback = async (req, res) => {
    res.redirect('/home');
  };

  // logout
  export const signOut= async(req,res)=>
  {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ message: "Error logging out." });
        }
        res.redirect('/');
      
    });// apparently it logsout sessions .only works with passport.js but still able to logout everyone
   
  }
  // reset password
   export const resetPassword= async(req,res)=>
  {
    const{email,password,confirmPassword}=req.body;
    if(password !==confirmPassword)
    {
        return res.status(401).json({message:"passwords donot match"});
    }
    const newPassword=password;
    try{
      
        await User.updateOne({email},{password:newPassword});
        res.json({message:"password updated succesfully"});

    }catch(error)
    {
        res.status(500).json({message:"not able to reset password"});
    }

  }
  // forgot-password
  export const forgetPassword= async(req,res)=>{
    const {email}=req.body;
    const user= await User.findOne({email});
    if(!user)
    {
        res.status(401).json({error:"user not found"});

    }
    const token= jwt.sign({userId:user._id},process.env.RESET_PASSWORD_TOKEN_SECRET,{expiresIn:'1h'});
    user.resetPasswordToken=token;
    user.resetPasswordExpires=Date.now()+3600000;//1 hour
    await user.save();

    // now lets send mail
    const transporter= nodemailer.createTransport({
        service:"Gmail",
        auth:{
            user:process.env.EMAIL_USER,
            pass:process.env.EMAIL_PASS,
        }
    });
    const mailoptions= {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Reset',
        text:  `Reset your password: http://localhost:5005/setnewpassword?token=${token}`

    };
    try {
        await transporter.sendMail(mailoptions);
        console.log('Password reset email sent successfully.');
        return res.status(200).json({ message: 'Password reset email sent' });
      } catch (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ message: 'Failed to send email' });
      }
  }
  // verify token and set new password
      export const setPassword= async(req,res)=>
        {
           const {token,newPassword} = req.body;
           console.log(token);
           try
           {
              const decoded= jwt.verify(token, process.env.RESET_PASSWORD_TOKEN_SECRET);
              const user= await User.findById(decoded.userId);

              if(!user || user.resetPasswordExpires<Date.now())
              {
                return res.status(400).json({ error: 'Token expired or invalid' });
              }
              user.password = await bcrypt.hash(newPassword, 10);
              user.resetPasswordToken=undefined;
              user.resetPasswordExpires=undefined;

              await user.save();

              res.json({ message: 'Password reset successfully' });

           }catch(error)
           {
            console.error(error);
            res.status(400).json({ error: 'Token expired or invalid' });
           }

        }