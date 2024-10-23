const express = require('express');
const router = express.Router();
const signupForm = require('../controller/signupForm');

router.get('/',signupForm.signupForm);

module.exports = router