const userController = require('../constroller/user')
const userAuthentication = require('../middleware/auth')

const express = require('express');

const router = express.Router();

router.get('/signup',userController.getSignUpPage);

router.post('/signup',userController.postSignupPage);

router.get('/login',userController.getLoginPage);

router.post('/login',userController.postLoginPage);

router.get('/ispremium',userAuthentication.authenticate,userController.isPremium);

module.exports  = router