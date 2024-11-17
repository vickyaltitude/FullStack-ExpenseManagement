
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const ForgotPassReq = require('../util/forgotPassReq');
const User = require('../util/users');
const Sib = require('sib-api-v3-sdk');
const client = Sib.ApiClient.instance;
const apikey = client.authentications['api-key'];
apikey.apiKey = process.env.brevo_api_key; 
let transEmailApi = new Sib.TransactionalEmailsApi();

module.exports.sendLoginForm = (req,res)=>{

    res.sendFile(path.join(__dirname,'..','view','forgotpassword.html'))
 
    
 }

 module.exports.sendResetLink = (req,res)=>{

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
            
            User.find({email: receiverEmail}).then(result =>{
                console.log(result)

                ForgotPassReq.create({UUid: uuid,user_id:result[0]._id,isactive:true}).then(result =>{
                      
                    res.status(200).json({ msg: 'Password reset email sent successfully.' });

                }).catch(err =>{
                    console.log(err)
                    res.status(500).json({msg:'error while inserting into forgatpassword collection'})
                })

            }).catch(err =>{
                console.log(err)
                res.status(500).json({msg:'error while getting userId'})
            })

           
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
 
    
 }