const User = require('../model/user')

exports.getLeaderboard = async(req,res,next)=>{
    // first getting all users
    let userArray = await User.findAll()
    let leaderboardArray = [];
    for(let user of userArray){
        let userInfoObj = {name:user.dataValues.name}
        // finding all expenses of user and adding
        let totalExpense = 0;
        let expenseArray = await user.getExpenses()
        expenseArray.forEach((expense)=>{
            totalExpense += expense.dataValues.amount
        })
        // adding total expense on userInfoObj
        userInfoObj.expenses = totalExpense
        // pushing userInfoObj in leaderboardArray
        leaderboardArray.push(userInfoObj)    
    }
    // now sorting the leaderboradArray in descending order of expenses
    leaderboardArray.sort((a,b)=> b.expenses - a.expenses)

    res.json({leaderboardArray:leaderboardArray})
}