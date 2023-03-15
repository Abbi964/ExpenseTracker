const User = require('../model/user');
const Expense = require('../model/expense');
const sequelize = require('../util/database');

exports.getLeaderboard = async(req,res,next)=>{
    let leaderboardArray = await User.findAll({
        attributes:['name','totalExpense'],
        order:[
            ['totalExpense','DESC']
        ]
    })
    res.json({leaderboardArray:leaderboardArray})

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