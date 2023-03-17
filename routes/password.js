const passwordController = require('../constroller/password')

const express = require('express');

const router = express.Router();

router.get('/forgotpassword',passwordController.getforgotPassword)

module.exports = router;