const path = require('path');

module.exports.signupForm = (req,res)=>{
    res.sendFile(path.join(__dirname,'..','view','signup.html'))
}