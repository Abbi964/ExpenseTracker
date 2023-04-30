const sequelize = require('../util/database')

const path = require('path');
const Expense = require('../model/expense')

const jwt = require('jsonwebtoken');


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
        let page = +req.query.page
        let user = req.user
        let maxExpPerPage = +req.query.noOfrows
        console.log(maxExpPerPage)
        // now finding how many expenses are there
        let totalExpense = await user.countExpenses()  //magic method
        // calculation last page
        let lastPage = Math.ceil(totalExpense/maxExpPerPage)
        // using magic methods provided by sequelize to access expenses from user
        // as user has many expenses(relation)
        let expensesArray = await user.getExpenses({
            offset: (page-1) * +maxExpPerPage,
            limit: +maxExpPerPage
        });
        res.json({
            expenses:expensesArray,
            havePreviousPage:page>1,
            previousPage:page-1,
            haveNextPage:page<lastPage,
            nextPage:page+1,
            currentPage:page
        })
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
        console.log(err)
    }
}



function tokenToData(token){
    return jwt.verify(token,process.env.JWT_KEY)
}