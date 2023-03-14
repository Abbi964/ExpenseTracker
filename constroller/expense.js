const path = require('path');
const Expense = require('../model/expense')

const jwt = require('jsonwebtoken');
const { constants } = require('buffer');


exports.getExpenseTracker = (req,res,next)=>{
    res.sendFile(path.join(__dirname,'..','views','expense.html'))
}

exports.addExpense = (req,res,next)=>{
    try{
        const amount = req.body.amount;
        const category = req.body.category;
        const description = req.body.description;
        const token = req.body.token;
        // getting userid from token
        let data = tokenToData(token)
        let userId = data.userId 
        // adding info in expense table
        let expense = Expense.create({
            amount:amount,
            category:category,
            description:description,
            UserId:userId,
        })
        res.json(expense.id)
    }
    catch(err){
        console.log(err)
    }

}

exports.getAllExpenses = async(req,res,next)=>{
    try{
        let user = req.user
        // using magic methods provided by sequelize to access all expenses from user
        // as user has many expenses(relation)
        let allExpenses = await user.getExpenses();
        res.json(allExpenses)
    }
    catch(err){
        console.log(err)
    }
}

exports.deleteExpense = async(req,res,next)=>{
    try{
        let expenseId = req.params.expenseId;
        let token = req.headers.authorization;
        // getting userID from token
        let data = tokenToData(token)
        let userId = data.userId
        // finding the expense to destroy
        let exp = await Expense.findByPk(expenseId)
        // checking if id of exp is same as id given in token and destroying exp
        if(userId==exp.UserId){
            exp.destroy();
            res.json('expense deleted')
        }
        else{
            res.status(401).json('not autharized to delete')
        }
    }
    catch(err){
        console.log(err)
    }
}



function tokenToData(token){
    return jwt.verify(token,'98ab45fa145srv78ftrh8fth458sd45at7012awfgnmoyex')
}