const express = require('express');
const router = express.Router();
const sequelize = require('../util/sequelize');
const ds = require('../util/data');
const bcrypt = require('bcrypt');
const newUser = require('../controller/newUser');

router.post('/', newUser.newUser)

module.exports = router;