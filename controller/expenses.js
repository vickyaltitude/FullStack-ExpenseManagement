const jwt = require('jsonwebtoken');
require('dotenv').config();
const Expense = require('../util/expDetails');
const User = require('../util/users')
const mongoose = require('mongoose');


module.exports.expensesAPI = (req,res)=>{

    const receivedhead = req.header("Authorization");
    const token = receivedhead.split(' ')[1];
    const user = jwt.verify(token,process.env.JWT_TOKEN_SECRET);

    console.log(user)



    Expense.find({ user_id: new mongoose.Types.ObjectId(user.userId) })
    .select('id amount description category createdDateTime user_id') 
    .populate('user_id', 'name')  
    .then(expenses => {
        console.log(expenses)
        res.json(expenses);
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({ msg: 'Error retrieving expenses' });
    });
   
}

module.exports.addExpense = async (req,res)=>{
  
    const receivedDat = req.body;
    const receivedhead = req.header("Authorization");
    const token = receivedhead.split(' ')[1];
    const user = jwt.verify(token,process.env.JWT_TOKEN_SECRET);

     Expense.create({amount: receivedDat.amnt,description: receivedDat.descr,category: receivedDat.catgry,user_id:user.userId}).then(result =>{
        Expense.aggregate([
            { $match: { user_id: new mongoose.Types.ObjectId(user.userId) } },
            { $group: {
                _id: '$user_id',
                totalExpense: { $sum: '$amount' } 
            }}
        ])
        .then(total => {
          console.log(total)
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

     }).catch(err => {
        console.error(err);
        res.status(500).json({ msg: 'Error while inserting expense' });
    });


};
  
   