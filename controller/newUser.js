const User = require('../util/users');
const bcrypt = require('bcrypt');

module.exports.newUser = async (req,res)=>{

    const name = req.body.name;
    const email = req.body.email;
    const passwd = req.body.pswd;

    bcrypt.hash(passwd,10, (err,hash)=>{
       if(err){
           console.log(err)
       }
       else{

       User.findOne({ email: email }).then(result =>{

             if(result){
                res.status(404).json({msg: 'User already exist'});
            
             }

             User.create({name: name,email: email,password: hash}).then(result =>{

                console.log('user insertion successful')
                res.status(200).json({msg: 'user added successfully'})

             })

            
       })

   
       }

    })
   
}