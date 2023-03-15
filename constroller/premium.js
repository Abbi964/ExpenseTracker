const User = require('../model/user');
const Expense = require('../model/expense');
const sequelize = require('../util/database');

exports.getLeaderboard = async(req,res,next)=>{
    // first getting id and name from all users and adding 'amount' from expense table
    // related to that user by joining both table using 'include'
    let leaderboardArray = await User.findAll({
        attributes:['id','name',[sequelize.fn('SUM',sequelize.col('expenses.amount')),'totalAmount']],
        include:[
            {
                model: Expense,
                attributes: []
            }
        ],
        group: 'user.id',  // grouping by id column from user table
        order:[
            ['totalAmount','DESC']  // ordering by total amount
        ]
    })
    
    res.json({leaderboardArray:leaderboardArray})
}