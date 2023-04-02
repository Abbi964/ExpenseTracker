const userController = require('../controller/user')
const userAuthenticaltion = require('../middleware/auth')

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

router.get('/download',userAuthenticaltion.authenticate,userController.downloadExpense)

router.post('/saveFileUrl',userAuthenticaltion.authenticate,userController.saveFileUrl)

router.get('/getFileUrls',userAuthenticaltion.authenticate,userController.getFileUrls)

module.exports  = router