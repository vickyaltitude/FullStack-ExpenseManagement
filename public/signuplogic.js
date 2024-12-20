const signupform = document.getElementById('signup-form');
const showmsg = document.getElementById('show-msg');
signupform.addEventListener('submit',userInsert);

async function userInsert(e){
    e.preventDefault();
   const nameValue = document.getElementById('name').value;
   const emailValue = document.getElementById('email').value;
   const passwd = document.getElementById('pswd').value;
   
   let sendUser = await fetch('http://localhost:6969/insertuser',{
    method: 'POST',
    headers: {
        "Content-Type" : 'application/json'
    },
    body: JSON.stringify({
        name: nameValue,
        email: emailValue,
        pswd : passwd
    })
   })


   if (!sendUser.ok) {
    const errorMsg = document.createElement('p');
    errorMsg.innerText = 'User Email already exists!!  Please login'
    errorMsg.style.fontSize = "1.4rem";
    errorMsg.style.color = 'red';
    signupform.appendChild(errorMsg);

    setTimeout(()=>{
            signupform.removeChild(errorMsg);
           
          
    },3000)
   } else if(sendUser.ok) {
      
       const successMsg = document.createElement('p');
    successMsg.innerText = 'User successfully created!! Please wait...'
    successMsg.style.fontSize = "1.4rem";
    successMsg.style.color = 'green';
    signupform.appendChild(successMsg);

    setTimeout(()=>{
            signupform.removeChild(successMsg);
            window.location.href = 'http://localhost:6969/login';
           
          
    },3000)
   }
   
}

