const path  = require('path')

const bcrypt = require('bcrypt')

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
                    res.json('Sucessfully loged in')
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