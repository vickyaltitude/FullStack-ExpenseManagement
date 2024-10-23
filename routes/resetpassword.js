const express = require('express');
const router = express.Router();
const path = require('path');
const ds = require('../util/data');
const bcrypt = require('bcrypt');
const resetPass = require('../controller/resetPass');


router.get('/:id',resetPass.resetLink);

router.post('/resetpassworddatabase',resetPass.passwordUpdate);

module.exports = router