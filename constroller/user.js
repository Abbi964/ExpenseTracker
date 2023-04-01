const path  = require('path')

const sequelize = require('../util/database')

const bcrypt = require('bcrypt')

const jwt = require('jsonwebtoken')

const User = require('../model/user')

const AWS = require('aws-sdk')
const { reject } = require('bcrypt/promises')

const UserServices = require('../services/user');
const S3Services = require('../services/s3');

exports.getSignUpPage = (req,res,next)=>{
    res.sendFile(path.join(__dirname,'..','views','signup.html'));
}

exports.postSignupPage = async(req,res,next)=>{
    const t = await sequelize.transaction()
    try{
        const name = req.body.name
        const email = req.body.email
        const password = req.body.password
        // hashing the password
        bcrypt.hash(password,10,async(err,hash)=>{
            // finding or creating user
            let [user,created] = await User.findOrCreate({
                where:{email:email},
                defaults:{
                    name:name,
                    email:email,
                    password:hash,
                    totalExpense:0,
                    totalIncome:0,
                },
                transaction:t,
            })
            await t.commit()
            res.json(created);
        })
    }
    catch(err){
        await t.rollback()
        console.log(err)
    }
}

exports.getLoginPage = (req,res,next)=>{
    res.sendFile(path.join(__dirname,'..','views','login.html'))
}

exports.postLoginPage = async(req,res,next)=>{
    const t = await sequelize.transaction()
    try{
        const email = req.body.email;
        const password = req.body.password;
        let user = await User.findOne({
            where:{email:email},
            transaction:t,
        });
        await t.commit()
        // checking if user email exists in DB or not
        if(user===null){
            res.status(404).json({msg:'User not found'})
        }
        else{
            bcrypt.compare(password,user.dataValues.password,async(err,same)=>{
                if (err) {
                    console.log(err);
                    res.status(500).json({ msg: 'Internal server error' });
                }
                else if(same){
                    
                    res.json({msg:'logging in user',token:generateJWT(user.dataValues.id , user.dataValues.isPremiumUser)})
                }
                else{
                    res.status(401).json({msg:'User not authorized'})
                }
            })
        }
    }
    catch(err){
        t.rollback();
        console.log(err)
    }
}

exports.isPremium = (req,res,next)=>{
    try{
        let token = req.headers.authorization
        let data = tokenToData(token)
        res.json({isPremiumUser:data.isPremium}) 
    }
    catch(err){
        console.log(err)
    }
}

exports.makePremiumInLocalStorage = (req,res,next)=>{
    const token = req.headers.authorization
    let data = tokenToData(token);
    let newToken =  generateJWT(data.userId,true)
    res.json({token:newToken}) 
}

exports.addToTotalExpense = async(req,res,next)=>{
    const t = await sequelize.transaction();
    try{
        amount = req.body.amount
        token = req.body.token
        let data = tokenToData(token);
        let userId = data.userId;
        let user = await User.findOne({
            where:{id:userId},
            transaction:t,
        })
        await t.commit()
        user.totalExpense = parseInt(user.totalExpense) + parseInt(amount)
        user.save();
        res.json('updated')
    }
    catch(err){
        await t.rollback()
        console.log(err)
    }
}

exports.addToTotalIncome = async(req,res,next)=>{
    const t = await sequelize.transaction();
    try{
        amount = req.body.amount
        token = req.body.token
        let data = tokenToData(token);
        let userId = data.userId;
        let user = await User.findOne({
            where:{id:userId},
            transaction:t,
        })
        await t.commit()
        user.totalIncome = parseInt(user.totalIncome) + parseInt(amount)
        user.save();
        res.json('updated')
    }
    catch(err){
        await t.rollback()
        console.log(err)
    }
}

exports.downloadExpense = async(req,res,next)=>{
    try{
        let user = req.user
        let incomes = UserServices.getExpenses(user);
        let expenses = UserServices.getIncomes(user);
        let incExp = await Promise.all([incomes,expenses])
        let stringifiedIncExp = JSON.stringify(incExp)
        // filename should depend on user id and time of request
        let filename = `Expense-${user.id}/${new Date}.txt`
        let fileUrl = await S3Services.uploadToS3(stringifiedIncExp,filename)
        res.json({fileUrl,success:true})
    }
    catch(err){
        console.log(err)
    }
}

exports.saveFileUrl = async(req,res,next)=>{
    try{
        let user = req.user
        await user.createFileUrl({url:req.body.fileUrl})
        res.json('done')
    }
    catch(err){
        console.log(err)
    }
}

exports.getFileUrls = async(req,res,next)=>{
    try{
        // getting all file urls downloaded by user
        let fileUrlArray = await req.user.getFileUrls()
        res.json({downloadedFiles:fileUrlArray})
    }
    catch(err){
        console.log(err)
    }
}


function generateJWT(id,isPremiumUser){
    return jwt.sign({userId:id , isPremium:isPremiumUser},process.env.JWT_KEY)
}

function tokenToData(token){
    return jwt.verify(token,process.env.JWT_KEY)
}