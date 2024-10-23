const express = require('express');
const router = express.Router();
const path = require('path');
const home = require('../controller/home');



router.get('/home',home.normalDashboard);

router.get('/premiumuserhome',home.premiumUserDashboard);

module.exports = router;