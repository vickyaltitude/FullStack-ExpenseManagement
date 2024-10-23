const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const ds = require('../util/data');
const sequelize = require('../util/sequelize');
require('dotenv').config();
const expenses = require('../controller/expenses');

router.get('/',expenses.expensesAPI);

router.post('/',expenses.addExpense);

module.exports = router;