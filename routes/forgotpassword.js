const express = require('express');
const router = express.Router();
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const Sib = require('sib-api-v3-sdk');
const client = Sib.ApiClient.instance;
const apikey = client.authentications['api-key'];
apikey.apiKey = process.env.brevo_api_key; 
let transEmailApi = new Sib.TransactionalEmailsApi();
const ds = require('../util/data');


router.get('/',(req,res)=>{

    res.sendFile(path.join(__dirname,'..','view','forgotpassword.html'))
 
    
 })

 router.post('/',(req,res)=>{

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
             htmlContent: `<p>Please reset your password through this link: <a href="http://13.233.144.215:6969/resetpassword/${uuid}">Reset Password</a></p>`
        })
        .then(response => {

            console.log(response,receiverEmail);
            ds.execute('SELECT id FROM users WHERE email = ?',[receiverEmail]).then(resp =>{
                 const userid = resp[0]
                 console.log(userid,uuid)
                
             ds.execute('INSERT INTO `forgot_password_requests` VALUES (?,?,?)',[uuid,userid[0].id,true]).then(resp =>{
                res.status(200).json({ msg: 'Password reset email sent successfully.' });
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

 module.exports = router;