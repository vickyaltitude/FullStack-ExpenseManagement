const loginform = document.getElementById('login-form');
loginform.addEventListener('submit',userlogin);

async function userlogin(e){
    e.preventDefault();

   const emailValue = document.getElementById('email').value;
   const passwd = document.getElementById('pswd').value;
   
   let sendUser = await fetch('http://localhost:6969/login',{
    method: 'POST',
    headers: {
        "Content-Type" : 'application/json'
    },
    body: JSON.stringify({
        email: emailValue,
        pswd : passwd
    })
   })

   let parsed = await sendUser.json();

   if (!sendUser.ok) {
       
       if(parsed.msg == "User Email not found!"){
         
        const unfMsg = document.createElement('p');
        unfMsg.innerText = 'Entered User Email is Not Found!!'
        unfMsg.style.fontSize = "1.4rem";
        unfMsg.style.color = 'red';
        loginform.appendChild(unfMsg);

        setTimeout(()=>{
            loginform.removeChild(unfMsg);
           
          
    },3000)

       }else if(parsed.msg == "Password entered is incorrect!"){
        const passwrdMsg = document.createElement('p');
        passwrdMsg.innerText = 'Entered Password is Incorrect!!'
        passwrdMsg.style.fontSize = "1.4rem";
        passwrdMsg.style.color = 'red';
        loginform.appendChild(passwrdMsg);

        setTimeout(()=>{
            loginform.removeChild(passwrdMsg);
           
          
    },3000)
       }
   } else if(sendUser.ok) {
      localStorage.setItem('userId',parsed.userId);
       const successMsg = document.createElement('p');
    successMsg.innerText = 'Login successful'
    successMsg.style.fontSize = "1.4rem";
    successMsg.style.color = 'green';
    loginform.appendChild(successMsg);

    setTimeout(()=>{
        loginform.removeChild(successMsg);
        if(parsed.ispremium){

        window.location.href = 'http://localhost:6969/premiumUserHome';
            
        }else{
           
        window.location.href = 'http://localhost:6969/home';
        }
      
},1000)

   }
   
}

