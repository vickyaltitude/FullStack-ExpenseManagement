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
const Sequelize = require('sequelize');
const { v4: uuidv4 } = require('uuid');


const Sib = require('sib-api-v3-sdk');
const client = Sib.ApiClient.instance;
const apikey = client.authentications['api-key'];
apikey.apiKey = process.env.brevo_api_key; // Ensure this is set correctly
const transEmailApi = new Sib.TransactionalEmailsApi();



const sequelize = new Sequelize('expense_tracker','root','Welcome@123',{
    dialect: 'mysql',
    host: 'localhost'
})



app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'view','signup.html'))
})

app.get('/home',(req,res)=>{
    res.sendFile(path.join(__dirname,'view','expensespage.html'))
})

app.post('/insertuser', async (req,res)=>{
     let tran = await sequelize.transaction();
     const name = req.body.name;
     const email = req.body.email;
     const passwd = req.body.pswd;

     bcrypt.hash(passwd,10, (err,hash)=>{
        if(err){
            console.log(err)
        }
        else{
           ds.execute('INSERT INTO `users` (name,email,password) VALUES(?,?,?)',[name,email,hash],{transaction : tran}).then(async resp =>{
            await tran.commit();
                res.status(200).json({msg: 'user added successfully'})
            }).catch( async err => {
               await tran.rollback();
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

app.post('/expenses',async (req,res)=>{
    let tran = await sequelize.transaction();
    const receivedDat = req.body;
    const receivedhead = req.header("Authorization");
    const token = receivedhead.split(' ')[1];
    const user = jwt.verify(token,"mysecretcode");
  
     ds.execute('INSERT INTO `expense_details` (amount,description,category,user_id) VALUES(?,?,?,?)',[receivedDat.amnt,receivedDat.descr,receivedDat.catgry,user.userId],{transaction: tran}).then( async resp =>{
        
        ds.execute(`UPDATE users u
                        SET total_expense = (
                            SELECT SUM(e.amount)
                            FROM expense_details e
                            WHERE e.user_id = u.id
                        )
                        WHERE u.id = ?;`,[user.userId]).then(async resp => {
                            await tran.commit()
                            res.json({msg: 'Expense inserted successfully'});

                        }).catch(async err => {
                            await tran.rollback()
                            console.log(err)
                        })


    }).catch(async err => {
        await tran.rollback();
        console.log(err)
    }) 
    
})

app.patch('/userpatch',async (req,res)=>{
    let tran = await sequelize.transaction();
    let received = req.body;
    let edited_amt = Number(received.amnt);
    let edt_descr = received.descr;
    let edt_catgry = received.catgry;
    let itemId = Number(received.itemId);
    const receivedhead = req.header("Authorization");
    const token = receivedhead.split(' ')[1];
    const user = jwt.verify(token,"mysecretcode");
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

app.delete('/userdelete',async (req,res)=>{
    let tran = await sequelize.transaction();
    const receivedDat = req.body;
    const item = Number(receivedDat.itemId);
    const receivedhead = req.header("Authorization");
    const token = receivedhead.split(' ')[1];
    const user = jwt.verify(token,"mysecretcode");
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

   ds.execute('SELECT * FROM users ORDER BY `total_expense` DESC').then(resp =>{
        
        res.json({msg: 'data received successfully' , data: resp[0]});
    }).catch(err => console.log(err))

   
})

app.get('/forgotpassword',(req,res)=>{

    res.sendFile(path.join(__dirname,'view','forgotpassword.html'))
 
    
 })

 app.post('/forgotpassword',(req,res)=>{

    console.log(req.body);
    if(req.body.emailfield){
        const receiverEmail = req.body.emailfield
        const sender = {
            email: 'vignvick3005@gmail.com'
        }
        const receiver = [
            {
                email : receiverEmail
            }
        ]
        const uuid = uuidv4().toString();
        transEmailApi.sendTransacEmail({
            sender,
            to: receiver,
            subject: 'Password reset link from Day-to-Day Expense Tracker Application',
             htmlContent: `<p>Please reset your password through this link: <a href="http://localhost:6969/resetpassword/${uuid}">Reset Password</a></p>`
        })
        .then(response => {

            console.log(response,receiverEmail);
            ds.execute('SELECT id FROM users WHERE email = ?',[receiverEmail]).then(resp =>{
                 const userid = resp[0]
                 console.log(userid,uuid)
                
             ds.execute('INSERT INTO `forgot_password_requests` VALUES (?,?,?)',[uuid,userid[0].id,true]).then(resp =>{
                res.json({ msg: 'Password reset email sent successfully.' });
             }).catch(err => console.log(err));
              
            }).catch(err => console.log(err))
           
        })
        .catch(error => {
            console.error('Error details:', error.response ? error.response.data : error);
            if (error.response) {
                console.error('Status:', error.response.status);
                console.error('Data:', error.response.data);
            }
            res.status(500).json({ msg: 'Failed to send password reset email. Please try again later.' });
        });
    }
 
    
 })

 app.get('/resetpassword/:id',(req,res)=>{
    const uuidreceived = req.params.id
    console.log(uuidreceived)
    ds.execute('SELECT * FROM `forgot_password_requests` WHERE id = ?',[uuidreceived]).then(resp =>{

        let responseData = resp[0];

        if(responseData[0].isactive){

            ds.execute('UPDATE `forgot_password_requests` SET isactive = ? WHERE id = ?',[false,responseData[0].id])
            res.sendFile(path.join(__dirname,'view','resetform.html'))
        }else{
            res.status(404).json({msg: 'URL for password reset has been expired!  Please try again'})
        }
      
       
    }).catch(err => console.log(err))
     
 })

app.post('/resetpassworddatabase',(req,res)=>{
     
    const received = req.body.passwordconfirmation;
     console.log(req.body)
     ds.execute('SELECT user_id FROM `forgot_password_requests` WHERE id = ?',[req.body.id]).then(resp =>{
        let id = resp[0]
        console.log(id[0])
        bcrypt.hash(received,10, (err,hash)=>{
            if(err){
                console.log(err)
            }
            else{
               ds.execute('UPDATE `users`  SET password = ? WHERE id = ?',[hash,id[0].user_id]).then(async resp =>{
               
                    res.status(200).json({msg: 'user added successfully'})
                }).catch( async err => {
                  
                    console.log(err) ;
                    res.status(404).json({msg: 'User already exist'});
                });
        
            }
    
         })
     }).catch(err => console.log(err))
   
    

})


app.listen(PORT,()=> console.log(`server is successfully running on port ${PORT}`))