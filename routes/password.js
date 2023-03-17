const passwordController = require('../constroller/password')

const express = require('express');

const router = express.Router();

router.get('/forgotpassword',passwordController.getforgotPassword);

router.post('/forgotpassword',passwordController.postForgotPassword);

module.exports = router;