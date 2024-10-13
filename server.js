const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 6969;
const ds = require('./util/data');
const bcrypt = require('bcrypt');
const generatedToken = require('./jwt');
const jwt = require('jsonwebtoken');


app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'view','signup.html'))
})

app.get('/home',(req,res)=>{
    res.sendFile(path.join(__dirname,'view','expensespage.html'))
})

app.post('/insertuser',(req,res)=>{

     const name = req.body.name;
     const email = req.body.email;
     const passwd = req.body.pswd;

     bcrypt.hash(passwd,10, (err,hash)=>{
        if(err){
            console.log(err)
        }
        else{
           ds.execute('INSERT INTO `users` (name,email,password) VALUES(?,?,?)',[name,email,hash]).then(resp =>{
                res.status(200).json({msg: 'user added successfully'})
            }).catch(err => {
                console.log(err) ;
                res.status(404).json({msg: 'User already exist'});
            });
    
        }

     })
    
})

app.get('/login',(req,res)=>{
    res.sendFile(path.join(__dirname,'view','login.html'))
})

app.post('/login',(req,res)=>{
    const email = req.body.email;
    const passwrd = req.body.pswd;
    ds.execute('SELECT * FROM users WHERE email = ?',[email]).then(resp =>{

        const datafetched = resp[0];


        if(datafetched.length == 0){
            res.status(404).json({msg: 'User Email not found!'})
        }else {

            bcrypt.compare(passwrd.toString(),datafetched[0].password,(err,result)=>{

                if(err){
                    res.status(500).json({msg: 'Something went wrong!!'})
                }
                if(result == true){
                    res.json({msg: 'User login successfull',userId: generatedToken.encryptuserid(datafetched[0].id,datafetched[0].name)})
                }
                else{
                    res.status(401).json({msg: 'Password entered is incorrect!'})
                }
            })
           
        }
    }).catch(err => console.log(err));
   
})

app.get('/expenses',(req,res)=>{

    const receivedhead = req.header("Authorization");
    const token = receivedhead.split(' ')[1];
    const user = jwt.verify(token,"mysecretcode");
   
    ds.execute('SELECT * FROM expense_details WHERE user_id = ?',[user.userId]).then(resp =>{
         let datas = resp[0];
         res.json({datas})
    }).catch(err => console.log(err));
})

app.post('/expenses',(req,res)=>{
    const receivedDat = req.body;
    const receivedhead = req.header("Authorization");
    const token = receivedhead.split(' ')[1];
    const user = jwt.verify(token,"mysecretcode");
  
     ds.execute('INSERT INTO `expense_details` (amount,description,category,user_id) VALUES(?,?,?,?)',[receivedDat.amnt,receivedDat.descr,receivedDat.catgry,user.userId]).then(resp =>{
       
    }).catch(err => console.log(err)) 
    res.json({msg: 'Expense inserted successfully'});
})

app.patch('/userpatch',(req,res)=>{

    let received = req.body;
    let edited_amt = Number(received.amnt);
    let edt_descr = received.descr;
    let edt_catgry = received.catgry;
    let itemId = Number(received.itemId);
    const receivedhead = req.header("Authorization");
    const token = receivedhead.split(' ')[1];
    const user = jwt.verify(token,"mysecretcode");
    ds.execute('UPDATE `expense_details` SET amount = ?,description = ?,category = ? WHERE id = ? AND user_id =?',[edited_amt,edt_descr,edt_catgry,itemId,user.userId]).then(resp => {
        res.json({msg: 'User updated successfully'})
    }).catch(err => console.log(err))
    

})

app.delete('/userdelete',(req,res)=>{
    const receivedDat = req.body;
    const item = Number(receivedDat.itemId);
    const receivedhead = req.header("Authorization");
    const token = receivedhead.split(' ')[1];
    const user = jwt.verify(token,"mysecretcode");
    ds.execute('DELETE FROM `expense_details` WHERE id = ? AND user_id = ?',[item,user.userId]).then(resp => {
        res.json({msg:'checking'});
    }).catch(err => console.log(err));
   
})

app.listen(PORT,()=> console.log(`server is successfully running on port ${PORT}`))