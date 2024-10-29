import mongoose from "mongoose";
import dotenv from "dotenv";


dotenv.config();

const connectToDatabase= async()=>
{
    try{

        const connect= await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to databse");
        console.log(connect.connection.host);
        
    }
    catch(error)
    {
       console.error("not able to connect to databse",error);
       process.exit(1);
    }
}


export default connectToDatabase;