const userController = require('../constroller/user')

const express = require('express');

const router = express.Router();

router.get('/signup',userController.getSignUpPage);

router.post('/signup',userController.postSignupPage);

router.get('/login',userController.getLoginPage);

router.post('/login',userController.postLoginPage);

router.get('/ispremium',userController.isPremium);

router.get('/makePremiumInLocalStorage',userController.makePremiumInLocalStorage);

router.post('/addToTotalExpense',userController.addToTotalExpense);

router.post('/addToTotalIncome',userController.addToTotalIncome);

module.exports  = router