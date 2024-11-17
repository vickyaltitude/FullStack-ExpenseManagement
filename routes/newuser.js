const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const newUser = require('../controller/newUser');

router.post('/', newUser.newUser)

module.exports = router;