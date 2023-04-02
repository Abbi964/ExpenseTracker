const expenseController = require('../controller/expense')
const userAuthenticaltion = require('../middleware/auth')

const express = require('express')

const router = express.Router();

router.get('/main',expenseController.getExpenseTracker);

router.post('/addexpense',expenseController.addExpense);

router.get('/all_expenses',userAuthenticaltion.authenticate,expenseController.getAllExpenses);

router.delete('/delete/:expenseId',expenseController.deleteExpense);

module.exports = router