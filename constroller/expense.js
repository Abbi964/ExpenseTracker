const path = require('path');
const Expense = require('../model/expense')

exports.getExpenseTracker = (req,res,next)=>{
    res.sendFile(path.join(__dirname,'..','views','expense.html'))
}

exports.addExpense = (req,res,next)=>{
    try{
        const amount = req.body.amount;
        const category = req.body.category;
        const description = req.body.description;
        // adding info in expense table
        let expense = Expense.create({
            amount:amount,
            category:category,
            description:description,
        })
        res.json(expense.id)
    }
    catch(err){
        console.log(err)
    }

}

exports.getAllExpenses = async(req,res,next)=>{
    try{
        let allExpenses = await Expense.findAll();
        res.json(allExpenses)
    }
    catch(err){
        console.log(err)
    }
}

exports.deleteExpense = (req,res,next)=>{
    try{
        let expenseId = req.params.expenseId;
        // finding the expense to destroy
        Expense.findByPk(expenseId)
            .then(exp=>{
                exp.destroy();
                res.json('expense deleted')
            })
    }
    catch(err){
        console.log(err)
    }
}