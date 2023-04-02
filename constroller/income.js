const sequelize = require('../util/database')

const path = require('path');
const Income = require('../model/income')

const jwt = require('jsonwebtoken');

exports.addIncome = async(req,res,next)=>{
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
        let income = await Income.create({
            amount:amount,
            category:category,
            description:description,
            UserId:userId,
        },
        {
            transaction:t,
        })
        await t.commit()
        res.json(income.id)
    }
    catch(err){
        await t.rollback()
        console.log(err)
    }
}

exports.getAllIncome = async(req,res,next)=>{
    try{
        let page = +req.query.page
        let user = req.user
        let maxExpPerPage = 5
        // now finding how many incomes are there
        let totalIncome = await user.countIncomes()  //magic method
        // calculation last page
        let lastPage = Math.ceil(totalIncome/maxExpPerPage)
        // using magic methods provided by sequelize to get incomes from user
        // as user has many incomes(relation)
        let incomesArray = await user.getIncomes({
            offset: (page-1) * +maxExpPerPage,
            limit: +maxExpPerPage
        });
        res.json({
            incomes:incomesArray,
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

exports.deleteIncome = async(req,res,next)=>{
    const t = await sequelize.transaction()
    try{
        let incomeId = req.params.incomeId;
        let token = req.headers.authorization;
        // getting userID from token
        let data = tokenToData(token)
        let userId = data.userId
        // finding the expense to destroy
        let inc = await Income.findByPk(incomeId,{
            transaction:t,
        })
        // before deleting income storing inc.amount so that can be substrated from total income of user
        let amount = inc.amount
        // checking if id of inc is same as id given in token and destroying inc
        if(userId==inc.UserId){
            inc.destroy();
            await t.commit()
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
