const path = require('path');
const User = require('../util/users');
const generatedToken = require('../jwt');
const bcrypt = require('bcrypt');



module.exports.sendLoginForm = (req,res)=>{
    res.sendFile(path.join(__dirname,'..','view','login.html'))
}

module.exports.userLoginAuth = (req,res)=>{
    const email = req.body.email;
    const passwrd = req.body.pswd;

    User.findOne({ email: email })
    .then(user => {

        if (user) {

            bcrypt.compare(passwrd.toString(),user.password,(err,result)=>{
        
                if(err){
                    res.status(500).json({msg: 'Something went wrong!!'})
                }
                if(result == true){
                    res.json({msg: 'User login successfull',ispremium: user.ispremium,userId: generatedToken.encryptuserid(user._id.toString(),user.name)})
                }
                else{
                    res.status(401).json({msg: 'Password entered is incorrect!'})
                }
            })
           
        } else {
         
            res.status(404).json({msg: 'User Email not found!'})
        }
    })
    .catch(err => {
        console.error(err);
        res.json({msg:'Error finding user:'})
    });


   
}