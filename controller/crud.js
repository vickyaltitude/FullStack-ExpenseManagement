
const jwt = require('jsonwebtoken');
require('dotenv').config();
const expDetails = require('../util/expDetails');
const mongoose = require('mongoose');
const User = require('../util/users');
const PremiumTrans = require('../util/premTrans');


module.exports.updateUser = async (req,res)=>{

   
    let received = req.body;
    let edited_amt = Number(received.amnt);
    let edt_descr = received.descr;
    let edt_catgry = received.catgry;
    let itemId = received.itemId;
    console.log('check update',itemId)
    const receivedhead = req.header("Authorization");
    const token = receivedhead.split(' ')[1];
    const user = jwt.verify(token,process.env.JWT_TOKEN_SECRET);
 console.log('check update',user.userId)
      expDetails.updateOne({_id : new mongoose.Types.ObjectId(itemId),user_id: new mongoose.Types.ObjectId(user.userId) },{
          amount: edited_amt,
          description: edt_descr,
          category: edt_catgry
      }).then(result =>{
         
        expDetails.aggregate([
            { $match: { user_id: new mongoose.Types.ObjectId(user.userId) } },
            { $group: {
                _id: '$user_id',
                totalExpense: { $sum: '$amount' } 
            }}
        ])
        .then(total => {
          console.log('checking total',total)
            if (!total || total.length === 0) {
                return res.status(404).json({ msg: 'No expenses found for this user' });
            }

            User.updateOne(
              
                { _id: new mongoose.Types.ObjectId(user.userId) }, 
                { total_expense: total[0].totalExpense }
            )
            .then(() => {
                res.json({ msg: 'Expense inserted successfully' });
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({ msg: 'Error while updating total expense' });

            });

        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ msg: 'Error while calculating total expenses' });
        });

      }).catch(err =>{
          console.log(err)
          res.status(500).json({ msg: 'Error while updating  expense' });
      })
    
    

}

module.exports.deleteUser = async (req,res)=>{
    
    const receivedDat = req.body;
    const item = receivedDat.itemId;
    const receivedhead = req.header("Authorization");
    const token = receivedhead.split(' ')[1];
    const user = jwt.verify(token,process.env.JWT_TOKEN_SECRET);

    expDetails.findOneAndDelete({ _id:  new mongoose.Types.ObjectId(item),user_id: new mongoose.Types.ObjectId(user.userId) }).then(result =>{

        expDetails.aggregate([
            { $match: { user_id: new mongoose.Types.ObjectId(user.userId) } },
            { $group: {
                _id: '$user_id',
                totalExpense: { $sum: '$amount' } 
            }}
        ])
        .then(total => {
          console.log('checking delete total',total)
            if (!total || total.length === 0) {
                return res.status(404).json({ msg: 'No expenses found for this user' });
            }

            User.updateOne(
              
                { _id: new mongoose.Types.ObjectId(user.userId) }, 
                { total_expense: total[0].totalExpense }
            )
            .then(() => {
                res.json({msg:'expense deleted successfully'});
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({ msg: 'Error while updating total expense' });

            });

        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ msg: 'Error while calculating total expenses' });
        });

    }).catch(err =>{

        console.log(err)

    })

    
   
}

module.exports.updateTransaction = (req,res)=>{
    const receivedhead = req.header("Authorization");
    const token = receivedhead.split(' ')[1];
    const user = jwt.verify(token,process.env.JWT_TOKEN_SECRET);
   
   if(req.body.payment_id){

    PremiumTrans.updateOne({order_id: req.body.order_id},{payment_id : req.body.payment_id,status: "success"}).then(result =>{
          
        User.updateOne({_id: new mongoose.Types.ObjectId(user.userId)},{ispremium: true}).then(result =>{
             console.log(result,'transaction update result')
             res.json({msg: 'payment success'});
        })
            
    })

   
   }else{

    PremiumTrans.updateOne({order_id: req.body.order_id},{stauts: "failed"}).then( result =>{

        res.json({msg: 'payment failed'});

    }).catch( err => {

         console.log(err)

    })

  
   }

}