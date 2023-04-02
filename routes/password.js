const passwordController = require('../controller/password')

const express = require('express');

const router = express.Router();

router.get('/forgotpassword',passwordController.getforgotPassword);

router.post('/forgotpassword',passwordController.postForgotPassword);

router.get('/resetPassword/:id',passwordController.getResetPassword);

router.post('/resetPassword/:id',passwordController.postResetPassword);

module.exports = router;