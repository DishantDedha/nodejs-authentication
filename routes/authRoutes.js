import express from "express";
import { signIn,signUp,resetPassword,signOut,forgetPassword,setPassword} from "../controllers/authController.js";
import passport from "passport";
import { googleCallback } from "../controllers/authController.js";


const router= express.Router();


router.post('/signup',signUp);
router.post('/signin',signIn);
router.get('/signout',signOut);
router.post('/reset-password',resetPassword);
router.post('/set-newpassword',setPassword);
router.post('/forget-password',forgetPassword);
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport.authenticate("google", { failureRedirect: '/signin' }),googleCallback);



export default router;
