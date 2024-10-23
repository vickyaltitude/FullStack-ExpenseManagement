const jwt = require('jsonwebtoken');
const ds = require('../util/data');
const sequelize = require('../util/sequelize');
require('dotenv').config();


module.exports.expensesAPI = (req,res)=>{

    const receivedhead = req.header("Authorization");
    const token = receivedhead.split(' ')[1];
    const user = jwt.verify(token,process.env.JWT_TOKEN_SECRET);
   
    ds.execute(`SELECT expense_details.id AS id,amount,description,category,user_id,created_date,name
FROM expense_details
INNER JOIN users ON expense_details.user_id = users.id
WHERE users.id = ?;`,[user.userId]).then(resp =>{
         let datas = resp[0];
         res.json({datas})
    }).catch(err => console.log(err));
}

module.exports.addExpense = async (req,res)=>{
    let tran = await sequelize.transaction();
    const receivedDat = req.body;
    const receivedhead = req.header("Authorization");
    const token = receivedhead.split(' ')[1];
    const user = jwt.verify(token,process.env.JWT_TOKEN_SECRET);
  
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
    
}