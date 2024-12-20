
let welcome = document.getElementById('welcome')
let expForm = document.getElementById('exp-form');
const getToken = localStorage.getItem('userId');
const currentUser =  `Bearer ${getToken}`;
let premiumBtn = document.getElementById('prm-btn');
let datum;
async function getData(){
    const exp_details = await fetch(`http://localhost:6969/expenses`, {
        headers:{
        "Authorization" : currentUser
    }});
    const parsed_details = await exp_details.json();
    welcome.innerText = `WELCOME ${parsed_details[0].user_id.name.toUpperCase()}`;
    welcome.style.color ='#0c5fac';
    console.log(parsed_details.length)
    if(parsed_details.length > 0){
        let page1 = document.getElementById('page-1');
        page1.style.display = 'block';
        page1.addEventListener('click',pagination)
    }
    if(parsed_details.length > 5) {
        let page2 = document.getElementById('page-2');
        page2.style.display = 'block'
        page2.addEventListener('click',pagination)

    }else if(parsed_details.length > 10){
        let page3 = document.getElementById('page-3');
        page3.style.display = 'block'
        page3.addEventListener('click',pagination)
    }
    else if(parsed_details.length > 15){
         let page4 = document.getElementById('page-4');
         page4.style.display = 'block'
         page4.addEventListener('click',pagination)
    }
    else if(parsed_details.length > 20){
         let page5 = document.getElementById('page-5');
         page5.style.display = 'block'
         page5.addEventListener('click',pagination)
    }
    else if(parsed_details.length > 25){
         let page6 = document.getElementById('page-6');
         page6.style.display = 'block'
         page6.addEventListener('click',pagination)
    }
    
  
    
    datum = parsed_details;
    loadData(parsed_details,0);
}
getData();

function loadData(dat,start){
   let trEle = document.getElementById('t-body');
  trEle.innerHTML = '';
    for(let i = start;i<start+5;i++){
        let newtr = document.createElement('tr');
        const date = new Date(dat[i].createdDateTime); 
        const options = { timeZone: 'Asia/Kolkata', hour12: false };
        const istTime = date.toLocaleString('en-US', options);
          console.log(dat[i]._id)
        newtr.innerHTML = `
                        <td>${istTime}</td>
                        <td>${dat[i].amount}</td>
                        <td>${dat[i].description}</td>
                        <td>${dat[i].category}</td>
                        <td><button id=${dat[i]._id} class="edit-btn" onclick="confirmEdit(event)">Edit</button> <button id=${dat[i]._id} class="delete-btn"  onclick="confirmDelete(event)">Delete</button></td>`;
        trEle.appendChild(newtr);
    }
    

}




expForm.addEventListener('submit',async (e)=>{
    e.preventDefault();
    
    let amount = document.getElementById('exp-amount');
    let description = document.getElementById('exp-description');
    let category = document.getElementById('exp-category');

    

    let add_exp = await fetch('http://localhost:6969/expenses',{
        method: 'POST',
        headers:{
            'Content-Type' : 'application/json',
            "Authorization" : currentUser
        },
        body: JSON.stringify({amnt: amount.value, descr : description.value , catgry : category.value})
    })
    amount.value = '';
    description.value = '';
    let parsedresp = await add_exp.json();
    
        console.log(parsedresp);
        window.location.reload();
})

let actionType = '';

function confirmDelete(e) {
    actionType = 'delete';
   
    document.getElementById('delete-msg-field').style.display = 'block';
    document.getElementById('confirmationModal').style.display = 'flex';
    document.getElementById('confirmationModal').style.justifyContent = 'center';
    document.getElementById('confirmationModal').style.alignItems = 'center';
    document.getElementById('id-to-delete-exp').innerText = e.target.id;
    console.log(actionType,e.target.id);
}

function confirmEdit(e) {
    actionType = 'edit';
    const getItems = e.target.parentNode.parentNode.children;
    document.getElementById('edit-amount').value = getItems[1].innerHTML;
    document.getElementById('edit-descr').value = getItems[2].innerHTML;
    document.getElementById('edit-category').value = getItems[3].innerHTML.trim();
    document.getElementById('id-to-delete-exp').innerText = e.target.id;

 
    document.getElementById('edit-form-field').style.display = 'block';
    document.getElementById('confirmationModal').style.display = 'flex';
    document.getElementById('confirmationModal').style.justifyContent = 'center';
    document.getElementById('confirmationModal').style.alignItems = 'center';
}

function closeModal() {
    document.getElementById('confirmationModal').style.display = 'none';
    document.getElementById('delete-msg-field').style.display = 'none';
    document.getElementById('edit-form-field').style.display = 'none';

}

async function performAction(e) {

    e.preventDefault();

    if (actionType === 'delete') {
        let getItemId = document.getElementById('id-to-delete-exp').innerText;

        let dlt_exp = await fetch('http://localhost:6969/items/userdelete',{
            method: 'DELETE',
            headers:{
                'Content-Type' : 'application/json',
                "Authorization" : currentUser
            },
            body: JSON.stringify({itemId : getItemId})
        })

        const stats = await dlt_exp.json();
      

        if(dlt_exp.status){
            window.location.reload();
          
        }
       
        console.log('Item deleted');

    } else if (actionType === 'edit') {

            let edited_amt =  document.getElementById('edit-amount');
            let edited_descr = document.getElementById('edit-descr');
             let edited_category =   document.getElementById('edit-category');
             let getItemId = document.getElementById('id-to-delete-exp').innerText;
             console.log(getItemId);
       
        let edit_exp = await fetch('http://localhost:6969/items/userpatch',{
            method: 'PATCH',
            headers:{
                'Content-Type' : 'application/json',
                "Authorization" : currentUser
            },
            body: JSON.stringify({amnt: edited_amt.value, descr : edited_descr.value , catgry : edited_category.value,itemId : getItemId})
        })

        
        if(edit_exp.status){
            window.location.reload();
        }else{
            console.log('something went wrong')
        }
    }
    closeModal();
}


window.onclick = function(event) {
    if (event.target === document.getElementById('confirmationModal')) {
        closeModal();
    }
}

premiumBtn.addEventListener('click',async (e)=>{
   e.preventDefault();

   try{
    let paymentReq = await fetch(`http://localhost:6969/premium/buypremium`, {
        headers:{
        "Authorization" : currentUser
    }});


    let responsereq = await paymentReq.json();
    console.log(responsereq);

      let razorUx = {
        key : responsereq.key_id,
        order_id : responsereq.order_details.id,
        handler : async function(response){
          let upd_trans =  await fetch(`http://localhost:6969/items/updatetransaction`, {
                method: 'POST', 
                headers: {
                    "Content-Type": "application/json", 
                    "Authorization": currentUser
                },
                body: JSON.stringify({
                    order_id: responsereq.order_details.id,
                    payment_id: response.razorpay_payment_id
                })
            });

            alert('You are a premium user now');

            if(upd_trans.ok){
                window.location.href = 'http://localhost:6969/home/premiumuserhome';
            }
        }

      }

      const rzp = new Razorpay(razorUx);
      rzp.open();
      rzp.on('payment failed',function(response){
        console.log(response);
        alert('something went wrong');
      })
   }catch(err){
    console.log(err)
   }


})

function pagination(e){
    let event = e.target.id;
    let split = event.split('-')
    let id = Number(split[1])
    loadData(datum,(id*5) - 5)
}