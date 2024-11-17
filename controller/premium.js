const path = require('path');
const uploadData = require('../util/uploadData');
const PremTransactionSchema = require('../util/premTrans');
const User = require('../util/users');
const ExpDetails = require('../util/expDetails');
const jwt = require('jsonwebtoken');
const Razorpay = require('razorpay');
require('dotenv').config();

module.exports.premiumBuy = (req,res)=>{

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
           
            PremTransactionSchema.create({user_name: user.userName,order_id:order.id,user_id: user.userId,status:'pending'}).then(result =>{

                res.json({order_details : order,key_id: process.env.Key_Id });

            }).catch(err =>{
                console.log(err);
                res.status(500).json({msg: 'error while inserting into transaction db'})
            })

           
           }
     })

}

module.exports.premiumDashboardList = (req,res)=>{
    res.sendFile(path.join(__dirname,'..','view','dashboard.html'))

}

module.exports.premiumListAPI = (req,res)=>{


    User.find()
  .sort({ total_expense: -1 })
  .exec()
  .then(expenses => {

    console.log('Expenses ordered by amount (desc):', expenses);
    res.json({msg: 'data received successfully' ,  expenses});

  })
  .catch(err => {

    console.error('Error fetching expenses:', err);
    res.status(500).json({msg:'error while fetching for premium dashboard'})
  });

   
 }

 module.exports.reportDownload = (req,res)=>{
    
    const receivedhead = req.header("Authorization");
    const token = receivedhead.split(' ')[1];
    const user = jwt.verify(token,process.env.JWT_TOKEN_SECRET);

    ExpDetails.find({user_id : user.userId}).then(async result =>{

              console.log(result)
                 let datas = result;
                 let stringified = JSON.stringify(datas);
                 const filename = `expense${datas[0].user_id}/${new Date()}.txt`;
                 const fileURL = await uploadData(stringified,filename)
                 res.json({fileURL})

    }).catch(err => {
                
        console.log(err)
        res.status(404).json({err})
    });


    
}