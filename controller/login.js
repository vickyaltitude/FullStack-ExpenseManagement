const path = require('path');
const generatedToken = require('../jwt');
const bcrypt = require('bcrypt');
const ds = require('../util/data');


module.exports.sendLoginForm = (req,res)=>{
    res.sendFile(path.join(__dirname,'..','view','login.html'))
}

module.exports.userLoginAuth = (req,res)=>{
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
   
}