const sequelize = require('../util/sequelize');
const ds = require('../util/data');
const bcrypt = require('bcrypt');

module.exports.newUser = async (req,res)=>{
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
   
}