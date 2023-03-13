const expenseController = require('../constroller/expense')

const express = require('express')

const router = express.Router();

router.get('/main',expenseController.getExpenseTracker);

router.post('/addexpense',expenseController.addExpense);

router.get('/all_expenses',expenseController.getAllExpenses);

router.delete('/delete/:expenseId',expenseController.deleteExpense);

module.exports = router