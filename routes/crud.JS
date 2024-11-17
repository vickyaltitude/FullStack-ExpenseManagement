
const express = require('express');
const router = express.Router();
const path = require('path');

const jwt = require('jsonwebtoken');
require('dotenv').config();
const crud = require('../controller/crud');


router.patch('/userpatch',crud.updateUser);

router.delete('/userdelete',crud.deleteUser);

router.post('/updatetransaction',crud.updateTransaction);

module.exports = router;