const express = require('express');
const router = express.Router();
const path = require('path');



router.get('/home',(req,res)=>{
    res.sendFile(path.join(__dirname,'..','view','expensespage.html'))
})

router.get('/premiumuserhome',(req,res)=>{
    res.sendFile(path.join(__dirname,'..','view','premiumUser.html'))
})

module.exports = router;