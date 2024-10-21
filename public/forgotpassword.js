const forgform = document.getElementById('forg-form');
const alertmsg = document.getElementById('alert-msg')


forgform.addEventListener('submit',async (e)=>{

 e.preventDefault();

 const emailfield = document.getElementById('email').value;
 console.log(emailfield);

 const sendEmail = await fetch('http://13.233.144.215:6969/forgotpassword',{
    method : 'POST',
    headers: {
        'Content-Type' : 'application/json'
    },
    body: JSON.stringify({emailfield
    })
 })
 
 const response = await sendEmail.json();

 if(sendEmail.ok){
       alertmsg.innerText = "Password reset link has been sent to the given email!  Please check"
       alertmsg.style.color = 'green';
       alertmsg.style.fontSize = '1.3rem';
       alertmsg.style.padding = '0px 20px';

 }
 console.log(response)

})