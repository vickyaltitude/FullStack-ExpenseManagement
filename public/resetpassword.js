const resetForm = document.getElementById('reset-form')

resetForm.addEventListener('click',async (e)=>{
   e.preventDefault();

   const passwordfield = document.getElementById('passwrd').value;
 const passwordconfirmation = document.getElementById('confirmpasswrd').value;

 if(passwordfield !== passwordconfirmation){
    
    const errorMsg = document.createElement('p');
    errorMsg.innerText = 'Entered User Email is Not Found!!'
    errorMsg.style.fontSize = "1.4rem";
    errorMsg.style.color = 'red';
    resetForm.appendChild(unfMsg);

    setTimeout(()=>{
        loginform.removeChild(errorMsg);
       
      
},4000)

 }

 else{
    const fullUrl = window.location.href;
    let splitted = fullUrl.split('/')
    console.log(fullUrl.split('/'))
  
     const sendupdatedPaswrd = await fetch('http://localhost:6969/resetpassworddatabase',{

         method: 'POST',
         headers: {
            'Content-Type' : 'application/json'
         },
         body: JSON.stringify({passwordconfirmation,id:splitted[4]})

     });

 }

})
