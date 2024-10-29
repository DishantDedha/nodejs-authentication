import mongoose from "mongoose";
import bcrypt from "bcrypt";


// user model

const userSchema= new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    googleId:
    {
        type:String
    },
    resetPasswordToken: 
    { type: String },
  resetPasswordExpires:
   { type: Date },
});

// function for hashing password
 userSchema.pre('save', async function(next){
    //ismodified is a mongoose method that ensures that the field is modified
    if(!this.isModified('password')) return next();
    this.password= await bcrypt.hash(this.password,10);
    next();
 });

 // method to compare password
 userSchema.methods.comparePassword= async function (password){
    return await bcrypt.compare(password,this.password);

 };

 const User= mongoose.model('User',userSchema);
 
 export default User;