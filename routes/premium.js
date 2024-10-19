const express = require('express');
const router = express.Router();
const path = require('path');
const uploadData = require('../util/uploadData');
const jwt = require('jsonwebtoken');
const Razorpay = require('razorpay');
const ds = require('../util/data');
require('dotenv').config();

router.get('/buypremium',(req,res)=>{

    const receivedhead = req.header("Authorization");
    const token = receivedhead.split(' ')[1];
    const user = jwt.verify(token,process.env.JWT_TOKEN_SECRET);
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

router.get('/premiumdashboard',(req,res)=>{
    res.sendFile(path.join(__dirname,'..','view','dashboard.html'))

})

router.get('/getpremiumdata',(req,res)=>{

   ds.execute('SELECT * FROM users ORDER BY `total_expense` DESC').then(resp =>{
        
        res.json({msg: 'data received successfully' , data: resp[0]});
    }).catch(err => console.log(err))

   
})

router.get('/reportdownload',(req,res)=>{
    
    const receivedhead = req.header("Authorization");
    const token = receivedhead.split(' ')[1];
    const user = jwt.verify(token,process.env.JWT_TOKEN_SECRET);

    ds.execute(`SELECT expense_details.id AS id,amount,description,category,user_id,created_date,name
        FROM expense_details
        INNER JOIN users ON expense_details.user_id = users.id
        WHERE users.id = ?;`,[user.userId]).then(async resp =>{
                 let datas = resp[0];
                 let stringified = JSON.stringify(datas);
                 const filename = `expense${datas[0].user_id}/${new Date()}.txt`;
                 const fileURL = await uploadData(stringified,filename)
                 res.json({fileURL})
            }).catch(err => {
                
                console.log(err)
                res.status(404).json({err})
            });
    
})

module.exports = router;