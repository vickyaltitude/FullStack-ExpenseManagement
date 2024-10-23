const express = require('express');
const router = express.Router();
const forgotPass = require('../controller/forgotpass');


router.get('/',forgotPass.sendLoginForm);

 router.post('/',forgotPass.sendResetLink);

 module.exports = router;