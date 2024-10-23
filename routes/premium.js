const express = require('express');
const router = express.Router();
const path = require('path');
const uploadData = require('../util/uploadData');
const jwt = require('jsonwebtoken');
const Razorpay = require('razorpay');
const ds = require('../util/data');
require('dotenv').config();
const premium = require('../controller/premium');

router.get('/buypremium',premium.premiumBuy);

router.get('/premiumdashboard',premium.premiumDashboardList);

router.get('/getpremiumdata',premium.premiumListAPI);

router.get('/reportdownload',premium.reportDownload);

module.exports = router;