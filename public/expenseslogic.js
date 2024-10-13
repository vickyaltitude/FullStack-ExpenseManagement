const expForm = document.getElementById('exp-form');
const getToken = localStorage.getItem('userId');
const currentUser =  `Bearer ${getToken}`;
async function getData(){
    const exp_details = await fetch(`http://localhost:6969/expenses`, {
        headers:{
        "Authorization" : currentUser
    }});
    const parsed_details = await exp_details.json();
    loadData(parsed_details.datas)
}
getData();

function loadData(dat){
   let trEle = document.getElementById('t-body');
    for(let i = 0;i<dat.length;i++){
        let newtr = document.createElement('tr');
        newtr.innerHTML = `<td>${dat[i].amount}</td>
                        <td>${dat[i].description}</td>
                        <td>${dat[i].category}</td>
                        <td><button id=${dat[i].id} class="edit-btn" onclick="confirmEdit(event)">Edit</button> <button id=${dat[i].id} class="delete-btn"  onclick="confirmDelete(event)">Delete</button></td>`;
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
    document.getElementById('edit-amount').value = getItems[0].innerHTML;
    document.getElementById('edit-descr').value = getItems[1].innerHTML;
    document.getElementById('edit-category').value = getItems[2].innerHTML.trim();
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

        let dlt_exp = await fetch('http://localhost:6969/userdelete',{
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
       
        let edit_exp = await fetch('http://localhost:6969/userpatch',{
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
