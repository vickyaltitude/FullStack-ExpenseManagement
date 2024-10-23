const path = require('path');

module.exports.normalDashboard = (req,res)=>{
    res.sendFile(path.join(__dirname,'..','view','expensespage.html'))
}

module.exports.premiumUserDashboard = (req,res)=>{
    res.sendFile(path.join(__dirname,'..','view','premiumUser.html'))
}