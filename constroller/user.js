const path  = require('path')

const bcrypt = require('bcrypt')

const jwt = require('jsonwebtoken')

const User = require('../model/user')

exports.getSignUpPage = (req,res,next)=>{
    res.sendFile(path.join(__dirname,'..','views','signup.html'));
}

exports.postSignupPage = async(req,res,next)=>{
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
                }
            })
            res.json(created);
        })
    }
    catch(err){
        console.log(err)
    }
}

exports.getLoginPage = (req,res,next)=>{
    res.sendFile(path.join(__dirname,'..','views','login.html'))
}

exports.postLoginPage = async(req,res,next)=>{
    try{
        const email = req.body.email;
        const password = req.body.password;
        let user = await User.findOne({where:{email:email}});
        // checking if user email exists in DB or not
        if(user===null){
            res.status(404).json({msg:'User not found'})
        }
        else{
            bcrypt.compare(password,user.dataValues.password,(err,same)=>{
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
    try{
        amount = req.body.amount
        token = req.body.token
        let data = tokenToData(token);
        let userId = data.userId;
        let user = await User.findOne({where:{id:userId}})
        user.totalExpense = parseInt(user.totalExpense) + parseInt(amount)
        user.save();
        res.json('updated')
    }
    catch(err){
        console.log(err)
    }
}


function generateJWT(id,isPremiumUser){
    return jwt.sign({userId:id , isPremium:isPremiumUser},'98ab45fa145srv78ftrh8fth458sd45at7012awfgnmoyex')
}

function tokenToData(token){
    return jwt.verify(token,'98ab45fa145srv78ftrh8fth458sd45at7012awfgnmoyex')
}