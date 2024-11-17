const path = require('path');
const bcrypt = require('bcrypt');
const ForgotPassReq = require('../util/forgotPassReq')
const User = require('../util/users');


module.exports.resetLink = (req,res)=>{
    const uuidreceived = req.params.id
    console.log(uuidreceived)
 
    ForgotPassReq.findOneAndUpdate(

        { UUid: uuidreceived, isactive: true },  
        { $set: { isactive: false } }, 
        { new: true } 

      ).then(result =>{
           
        if(!result){
            res.status(404).json({msg: 'URL for password reset has been expired!  Please try again'})
        }else{
            res.sendFile(path.join(__dirname,'..','view','resetform.html'))
        }

      }).catch(err =>{
          console.log(err)
          res.status(500).json({msg: 'error while getting information from forgotpassreslink!  Please try again'})
      })

   
     
 }

 module.exports.passwordUpdate = (req,res)=>{
     
    const received = req.body.passwordconfirmation;
     console.log(req.body)

     ForgotPassReq.find({UUid: req.body.id}).then(result =>{

        console.log(result)
        bcrypt.hash(received,10, (err,hash)=>{
            if(err){
                console.log(err)
            }
            else{
                
                User.updateOne({_id: result[0].user_id},{password: hash}).then(result =>{
                      
                    res.json({msg: 'password updated successfully'})

                }).catch(err => {
                    console.log(err)
                    res.status(500).json({msg:'error while inserting newpassword'})
                  
                })

        
            }
    
         })
          
     }).catch(err =>{

          console.log(err)
          res.status(500).json({msg:'error while getting information from forgotpassres'})

     })
   
    

}