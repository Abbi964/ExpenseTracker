const sequelize = require('../util/database')

const path = require('path');
const Expense = require('../model/expense')

const jwt = require('jsonwebtoken');
const { constants } = require('buffer');


exports.getExpenseTracker = (req,res,next)=>{
    res.sendFile(path.join(__dirname,'..','views','expense.html'))
}

exports.addExpense = async(req,res,next)=>{
    const t = await sequelize.transaction()
    try{
        const amount = req.body.amount;
        const category = req.body.category;
        const description = req.body.description;
        const token = req.body.token;
        // getting userid from token
        let data = tokenToData(token)
        let userId = data.userId 
        // adding info in expense table
        let expense = await Expense.create({
            amount:amount,
            category:category,
            description:description,
            UserId:userId,
        },
        {
            transaction:t,
        })
        await t.commit()
        res.json(expense.id)
    }
    catch(err){
        await t.rollback()
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
    const t = await sequelize.transaction()
    try{
        let expenseId = req.params.expenseId;
        let token = req.headers.authorization;
        // getting userID from token
        let data = tokenToData(token)
        let userId = data.userId
        // finding the expense to destroy
        let exp = await Expense.findByPk(expenseId,{
            transaction:t,
        })
        await t.commit()
        // before deleting expense storing exp.amount so that can be substrated from total expense of user
        let amount = exp.amount
        // checking if id of exp is same as id given in token and destroying exp
        if(userId==exp.UserId){
            exp.destroy();
            res.json({amount:amount})
        }
        else{
            res.status(401).json('not autharized to delete')
        }
    }
    catch(err){
        await t.rollback()
        console.log(err)
    }
}



function tokenToData(token){
    return jwt.verify(token,'98ab45fa145srv78ftrh8fth458sd45at7012awfgnmoyex')
}