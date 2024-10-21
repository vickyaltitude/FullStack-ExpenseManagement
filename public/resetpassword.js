const resetForm = document.getElementById('reset-form')

resetForm.addEventListener('submit',async (e)=>{
   e.preventDefault();

   const passwordfield = document.getElementById('passwrd').value;
 const passwordconfirmation = document.getElementById('confirmpasswrd').value;

 if(passwordfield !== passwordconfirmation){
    
    const errorMsg = document.createElement('p');
    errorMsg.innerText = 'Please enter the same password in both the field'
    errorMsg.style.fontSize = "1.4rem";
    errorMsg.style.color = 'red';
    resetForm.appendChild(errorMsg);

    setTimeout(()=>{
        resetForm.removeChild(errorMsg);
       
      
},4000)

 }

 else{
    const fullUrl = window.location.href;
    let splitted = fullUrl.split('/')
    console.log(fullUrl.split('/'))
  
     let sendupdatedPaswrd = await fetch('http://13.233.144.215/resetpassword/resetpassworddatabase',{

         method: 'POST',
         headers: {
            'Content-Type' : 'application/json'
         },
         body: JSON.stringify({passwordconfirmation,id:splitted[4]})

     });

     let parsedresp = await sendupdatedPaswrd.json();
     console.log(parsedresp)
      
     if(parsedresp.msg == 'password updated successfully'){
            
    const successMsg = document.createElement('p');
    successMsg.innerText = 'Password reset successfully!  Redirecting to login page...'
    successMsg.style.fontSize = "1.4rem";
    successMsg.style.color = 'green';
    resetForm.appendChild(successMsg);

    setTimeout(()=>{
        resetForm.removeChild(successMsg);
       window.location.href = 'http://13.233.144.215/login'
      
},4000)
     }
 }



})
