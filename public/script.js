document.addEventListener('DOMContentLoaded', () => {

    const signupForm= document.getElementById('signupForm');
    const signupButton=document.getElementById('google-signup');
    const signinForm= document.getElementById('signinForm');
    const signinButton=document.getElementById('google-signin');
    const signoutButton=document.getElementById('signout');
    const resetButton=document.getElementById('reset-password');
    const resetForm= document.getElementById('resetform');
    const forgotpasswordButton=document.getElementById('forget-password');
    const forgetPasswordForm= document.getElementById('forgetpasswordform');
    const setpasswordForm=document.getElementById('setpasswordform')

    if(signupForm){

    signupForm.addEventListener('submit',async(e)=>{
        e.preventDefault();

        const email= document.getElementById('email').value;
        const password=document.getElementById('password').value;
        const confirmPassword= document.getElementById('confirmPassword').value;
        const recaptchaResponse = grecaptcha.getResponse();// to get response from captcha


        if(password !== confirmPassword){
            alert("passwords donot match");
        return;
        }
        if(!recaptchaResponse)
        {
           alert('please complete recaptcha');
             return;
        }

        try{
                const response= await fetch('http://localhost:5005/auth/signup',{
                    method:'POST',
                    headers:{
                        'Content-Type':'application/json'
                    },
                    body: JSON.stringify({email,password,confirmPassword,recaptchaResponse})// passing to controller
                });
                if(!response.ok)
                {
                    const errordata= await response.json();
                    alert(`Error: ${errordata.message}`);
                }
                else{
                    alert('sign up succcesfull');
                    window.location.href='signIn.html'

                }
        }
        catch(error)
        {
            console.error("An Error occured during signup",error);
            alert("please try again later");
        }
    });
}
     if(signupButton){
    signupButton.addEventListener("click", () => {//? helps in processing null or undefined values
        window.location.href = "/auth/google";
      });
    }
    if(signinForm)
    {
        signinForm.addEventListener('submit',async(e)=>
        {
            e.preventDefault();
            const email= document.getElementById('email').value;
            const password= document.getElementById('password').value;
            const recaptchaResponse= grecaptcha.getResponse();

            if(!recaptchaResponse)
            {
                alert('please complete recaptcha');
                return;
            }
            try{
                const response= await fetch('http://localhost:5005/auth/signin',{
                    method: 'POST',
                    headers:
                    {
                        'Content-Type':'application/json'
                    },
                    body: JSON.stringify({email,password,recaptchaResponse})
                });
                if(!response.ok)
                {
                    const errordata= await response.json();
                    alert(`there is an error ${errordata.message}`);
                }
                else{
                    alert('Sign IN is successfull');
                    window.location.href='home.html';
                }

            } catch(error)
            {
                console.error("there is an error signing in",error);
                  alert("sigin has been failed");
            }
        })
    }
    if(signinButton)
    {
        signinButton.addEventListener('click',()=>{
          window.location.href='/auth/google';
        });
    }
    if(signoutButton)
    {
        signoutButton.addEventListener('click',()=>
        {
           window.location.href="/auth/signout";
        });
    }
    if(resetButton)
    {
        resetButton.addEventListener('click',()=>{
          window.location.href='resetPassword.html';  
        })
    }
    if(resetForm)
    {
        resetForm.addEventListener('submit',async (e)=>{
            e.preventDefault();
            const email= document.getElementById('resetemail').value;
            const password= document.getElementById('resetpassword').value;
            const confirmPassword=document.getElementById('confirmresetpassword').value;

            try{
                const response= await fetch('http://localhost:5005/auth/reset-password',{
                    method:'POST',
                    headers:{
                        'Content-Type': 'application/json'
                    },
                    body:JSON.stringify({email,password,confirmPassword})

                });
                if(response.ok)
                {
                    alert("password has been reset")
                    window.location.href='home.html';
                }

            } catch(error)
            {
                console.error('there is an erroe',error);
                alert("not able to reset password");
            }
        })
    }
    if(forgotpasswordButton)
    {
        forgotpasswordButton.addEventListener('click',()=>{
             window.location.href="reset-forget-password.html";
            
        });
    }
    if(forgetPasswordForm)
    {
        forgetPasswordForm.addEventListener('submit',async (e)=>{
            e.preventDefault();

            const email= document.getElementById('forgetemail').value;

            try{
                const response= await fetch('http://localhost:5005/auth/forget-password',{
                      method:"POST",
                      headers:
                      {
                        "Content-Type":"application/json"
                      },
                      body: JSON.stringify({email})
            });
            if(!response.ok)
                {
                    const errordata= await response.json();
                    alert(`there is an error ${errordata.message}`);
                }
                else{
                    alert('Kindly check your email');
                    window.location.href='signUp.html';
                }
            } catch(error)
            {
                console.error("there is an error while sending link",error);
                  alert("not able to send link");
            }
        });
    }
    if(setpasswordForm)
    {    setpasswordForm.addEventListener('submit',async(e)=>{
        e.preventDefault();

        const newPassword=document.getElementById('setnewpassword').value;
        try{
        const token = new URLSearchParams(window.location.search).get('token');
        console.log(token);

        const response= await fetch('http://localhost:5005/auth/set-newpassword',
            {
                method:"POST",
               headers:{
                 "Content-Type":"application/json"
               },
               body: JSON.stringify({token,newPassword})
            }
        );
        if(!response.ok)
            {
                const errordata= await response.json();
                alert(`there is an error ${errordata.message}`);
            }
            else{
                alert('password is reset taking you to signin page');
                window.location.href='signIn.html';
            }
    } 
    catch(error)
    {
        console.error("there is an error while resettin pass",error);
                  alert("not able to set pass");
    }
        
    });
    
    
  }
}
)