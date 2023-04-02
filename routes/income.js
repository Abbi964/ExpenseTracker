const incomeController = require('../controller/income');
const userAuthenticaltion = require('../middleware/auth')

const express = require('express');
const router = express.Router();

router.post('/addincome',incomeController.addIncome);

router.delete('/delete/:incomeId',incomeController.deleteIncome);

router.get('/all_income',userAuthenticaltion.authenticate,incomeController.getAllIncome);

module.exports = router;
