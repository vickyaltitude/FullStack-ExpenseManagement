const signupbtn = document.getElementById('signup-btn');

signupbtn.addEventListener('click',userInsert);

async function userInsert(){
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
       alert('User email already exists'); 
   } else if(sendUser.ok) {
       alert('User successfully created');
   }
   
}