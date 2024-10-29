import axios from "axios";
import dotenv from "dotenv";


dotenv.config();

export const verifyRecaptcha= async (recaptchResponse)=>{
    const secretkey= process.env.RECAPTCHA_SECRET_KEY;
    try{
    const response= await axios.post('https://www.google.com/recaptcha/api/siteverify',null,{
      params:
      {
        secret: secretkey,
        response: recaptchResponse,
      },
      
    });
    return response.data.success;
}
catch(error)
{
    console.error('reCAPTCHA verification error:', error);
    throw new Error('reCAPTCHA verification failed');
}
};