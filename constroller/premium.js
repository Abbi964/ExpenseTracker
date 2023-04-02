const User = require('../model/user');
const Expense = require('../model/expense');
const Income = require('../model/income')
const sequelize = require('../util/database');
const path = require('path')

exports.getLeaderboard = async(req,res,next)=>{
    try{
        let leaderboardArray = await User.findAll({
            attributes:['name','totalExpense'],
            order:[
                ['totalExpense','DESC']
            ]
        })
        res.json({leaderboardArray:leaderboardArray})
    }
    catch(err){
        console.log(err)
    }

    //------below is a way of doing if there is no total expense column in User(but its very process hungry)---///
    // // first getting id and name from all users and adding 'amount' from expense table
    // // related to that user by joining both table using 'include'
    // let leaderboardArray = await User.findAll({
    //     attributes:['id','name',[sequelize.fn('SUM',sequelize.col('expenses.amount')),'totalAmount']],
    //     include:[
    //         {
    //             model: Expense,
    //             attributes: []
    //         }
    //     ],
    //     group: 'user.id',  // grouping by id column from user table
    //     order:[
    //         ['totalAmount','DESC']  // ordering by total amount in DESC order
    //     ]
    // })
    
}

exports.getAllExpensePage  = (req,res,next)=>{
    try{
        console.log('reached')
        res.sendFile(path.join(__dirname,'..','views','allExpenses.html'))
    }
    catch(err){
        console.log(err)
    }
}

exports.getAllExpenses = async(req,res,next)=>{
    const t =  await sequelize.transaction()
    try{
        let user = req.user;
    
        let allExpense = await Expense.findAll({where:{userId : user.id},transaction:t})
        let allIncome = await Income.findAll({where:{userId : user.id},transaction:t})
        await t.commit()
        res.json({incomeArray:allIncome,expenseArray:allExpense})
    }
    catch(err){
        await t.rollback()
        console.log(err)
    }
}