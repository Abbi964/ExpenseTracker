const premiumController = require('../controller/premium');
const userAuthenticaltion = require('../middleware/auth')

const express = require('express');

const router = express.Router();

router.get('/getLeaderboard',premiumController.getLeaderboard);

router.get('/getAllExpensePage',premiumController.getAllExpensePage);

router.get('/getAllExpenses',userAuthenticaltion.authenticate,premiumController.getAllExpenses)

module.exports  = router