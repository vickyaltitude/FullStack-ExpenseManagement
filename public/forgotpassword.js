const forgform = document.getElementById('forg-form');


forgform.addEventListener('submit',async (e)=>{

 e.preventDefault();

 const emailfield = document.getElementById('email').value;
 console.log(emailfield);

 const sendEmail = await fetch('http://localhost:6969/forgotpassword',{
    method : 'POST',
    headers: {
        'Content-Type' : 'application/json'
    },
    body: JSON.stringify({emailfield
    })
 })
 
 const response = await sendEmail.json();
 console.log(response)

})