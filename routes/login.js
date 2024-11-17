const express = require('express');
const router = express.Router();
const path = require('path');
const generatedToken = require('../jwt');
const bcrypt = require('bcrypt');
const login = require('../controller/login');


router.get('/',login.sendLoginForm);

router.post('/',login.userLoginAuth);

module.exports = router;