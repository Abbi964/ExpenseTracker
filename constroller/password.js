const path = require('path')

exports.getforgotPassword = (req,res,next)=>{
    res.sendFile(path.join(__dirname,'..','views','forgotPassword.html'))
}