const express = require('express');
const router = express.Router();
const path = require('path');
const sequelize = require('../util/sequelize');
const jwt = require('jsonwebtoken');
const ds = require('../util/data');
require('dotenv').config();


router.patch('/userpatch',async (req,res)=>{
    let tran = await sequelize.transaction();
    let received = req.body;
    let edited_amt = Number(received.amnt);
    let edt_descr = received.descr;
    let edt_catgry = received.catgry;
    let itemId = Number(received.itemId);
    const receivedhead = req.header("Authorization");
    const token = receivedhead.split(' ')[1];
    const user = jwt.verify(token,process.env.JWT_TOKEN_SECRET);
    ds.execute('UPDATE `expense_details` SET amount = ?,description = ?,category = ? WHERE id = ? AND user_id =?',[edited_amt,edt_descr,edt_catgry,itemId,user.userId],{transaction: tran}).then(async resp => {

        ds.execute(`UPDATE users u
            SET total_expense = (
                SELECT SUM(e.amount)
                FROM expense_details e
                WHERE e.user_id = u.id
            )
            WHERE u.id = ?;`,[user.userId]).then( async resp => {
                await tran.commit();
                res.json({msg: 'User updated successfully'})

            }).catch(async err => {
                await tran.rollback();
                console.log(err)
            } )
      

    }).catch(async err => 
    {
        await tran.rollback();
        console.log(err)
    }
      )
    

})

router.delete('/userdelete',async (req,res)=>{
    let tran = await sequelize.transaction();
    const receivedDat = req.body;
    const item = Number(receivedDat.itemId);
    const receivedhead = req.header("Authorization");
    const token = receivedhead.split(' ')[1];
    const user = jwt.verify(token,process.env.JWT_TOKEN_SECRET);
    ds.execute('DELETE FROM `expense_details` WHERE id = ? AND user_id = ?',[item,user.userId],{transaction: tran}).then(resp => {

        ds.execute(`UPDATE users u
            SET total_expense = (
                SELECT SUM(e.amount)
                FROM expense_details e
                WHERE e.user_id = u.id
            )
            WHERE u.id = ?;`,[user.userId]).then(async resp => {
                await tran.commit();
                res.json({msg:'expense deleted successfully'});

            }).catch(async err =>{ 
               await tran.rollback();
                console.log(err)
            })
        

    }).catch(async err => {

        await tran.rollback();
         
        console.log(err)
    }
       );
   
})

router.post('/updatetransaction',(req,res)=>{
    const receivedhead = req.header("Authorization");
    const token = receivedhead.split(' ')[1];
    const user = jwt.verify(token,process.env.JWT_TOKEN_SECRET);
   
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

module.exports = router;