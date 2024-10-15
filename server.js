const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 6969;
const ds = require('./util/data');
const bcrypt = require('bcrypt');
const generatedToken = require('./jwt');
const jwt = require('jsonwebtoken');
const Razorpay = require('razorpay');
require('dotenv').config();



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
                    res.json({msg: 'User login successfull',ispremium:datafetched[0].ispremium,userId: generatedToken.encryptuserid(datafetched[0].id,datafetched[0].name)})
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

app.get('/buypremium',(req,res)=>{

    const receivedhead = req.header("Authorization");
    const token = receivedhead.split(' ')[1];
    const user = jwt.verify(token,"mysecretcode");
      console.log(user)
     let rzp = new Razorpay({
        key_id : process.env.Key_Id,
        key_secret: process.env.key_secret_id
     });
    let amount = 100;
    console.log(process.env.Key_Id,process.env.key_secret_id)
     rzp.orders.create({amount: amount, currency: 'INR'},(err,order)=>{
           if(err){
            console.log(err)
           }else{
            ds.execute('INSERT INTO `premium_transactions` (user_name,order_id,user_id,status) VALUES(?,?,?,?)',[user.userName,order.id,user.userId,'pending']).then(resp =>{

                res.json({order_details : order,key_id: process.env.Key_Id });

            }).catch(err => console.log(err)) 
           
           }
     })

})

app.post('/updatetransaction',(req,res)=>{
    const receivedhead = req.header("Authorization");
    const token = receivedhead.split(' ')[1];
    const user = jwt.verify(token,"mysecretcode");
   
   if(req.body.payment_id){
    ds.execute('UPDATE `premium_transactions` SET payment_id = ?,status = ? WHERE order_id =?',[req.body.payment_id,"succes",req.body.order_id]).then(resp => {
        res.json({msg: 'payment success'});



    }).catch(err =>{

        console.log(err)

    })

    ds.execute('UPDATE users SET ispremium = ? WHERE id =?',[true,user.userId]).then(resp => {
     

    }).catch(err =>{

        console.log(err)

    })
   
   }else{

    ds.execute('UPDATE `premium_transactions` SET status = ? WHERE order_id = ?',["failed",req.body.order_id]).then(resp => {
        res.json({msg: 'payment failed'});
    }).catch(err =>{

        console.log(err)

    })
  
   }

})

app.get('/premiumUserHome',(req,res)=>{
    res.sendFile(path.join(__dirname,'view','premiumUser.html'))
})

app.get('/premiumdashboard',(req,res)=>{
    res.sendFile(path.join(__dirname,'view','dashboard.html'))

})

app.get('/getpremiumdata',(req,res)=>{
    ds.execute(`SELECT SUM(expense_details.amount) AS total , expense_details.user_id ,users.name , users.email
    FROM expense_details 
    INNER JOIN users
    ON expense_details.user_id = users.id
    GROUP BY expense_details.user_id , users.name,users.email
    ORDER BY total DESC
    ;`).then(resp =>{
        console.log(resp[0])
        res.json({msg: 'data received successfully' , data: resp[0]});
    }).catch(err => console.log(err))

   
})


app.listen(PORT,()=> console.log(`server is successfully running on port ${PORT}`))