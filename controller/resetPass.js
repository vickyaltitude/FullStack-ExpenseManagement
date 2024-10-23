const path = require('path');
const ds = require('../util/data');
const bcrypt = require('bcrypt');


module.exports.resetLink = (req,res)=>{
    const uuidreceived = req.params.id
    console.log(uuidreceived)
    ds.execute('SELECT * FROM `forgot_password_requests` WHERE id = ?',[uuidreceived]).then(resp =>{

        let responseData = resp[0];

        if(responseData[0].isactive){

            ds.execute('UPDATE `forgot_password_requests` SET isactive = ? WHERE id = ?',[false,responseData[0].id])
            res.sendFile(path.join(__dirname,'..','view','resetform.html'))
        }else{
            res.status(404).json({msg: 'URL for password reset has been expired!  Please try again'})
        }
      
       
    }).catch(err => console.log(err))
     
 }

 module.exports.passwordUpdate = (req,res)=>{
     
    const received = req.body.passwordconfirmation;
     console.log(req.body)
     ds.execute('SELECT user_id FROM `forgot_password_requests` WHERE id = ?',[req.body.id]).then(resp =>{
        let id = resp[0]
        console.log(id[0])
        bcrypt.hash(received,10, (err,hash)=>{
            if(err){
                console.log(err)
            }
            else{
               ds.execute('UPDATE `users`  SET password = ? WHERE id = ?',[hash,id[0].user_id]).then(async resp =>{
               
                    res.status(200).json({msg: 'password updated successfully'})
                }).catch( async err => {
                  
                    console.log(err) ;
                    res.status(404).json({msg: 'failed! something went wrong'});
                });
        
            }
    
         })
     }).catch(err => console.log(err))
   
    

}