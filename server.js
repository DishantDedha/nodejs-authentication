// passport enables implementataion of different strats 
//passport-google-oauth20 is a strat for authentication via google id
// connect mongo is used in conjuction with express session for session peristance in mongodb(enables user session even after restart)

import app from "./app.js";
import dotenv from "dotenv";

dotenv.config();

const port= process.env.PORT || 5005;

app.listen(port,()=>{
    console.log(`Server is listening at ${port}`);
})




