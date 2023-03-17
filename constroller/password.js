const path = require('path')

var SibApiV3Sdk = require('sib-api-v3-sdk');
var defaultClient = SibApiV3Sdk.ApiClient.instance;
var apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.SEND_IN_BLUE_API_KEY

exports.getforgotPassword = (req,res,next)=>{
    res.sendFile(path.join(__dirname,'..','views','forgotPassword.html'))
}

exports.postForgotPassword = async(req,res,next)=>{
    try{
    
        const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();
    
        const sender = {
            email: 'abhinavthapliyal964@gmail.com'
        }
    
        const receivers = [
            {
                email: req.body.email
            },
        ]
    
        let result = await tranEmailApi.sendTransacEmail({
            sender,
            to: receivers,
            subject: 'Reset your password',
            textContent: 'this is a dummy email for testing pusrpuses'
        })
        console.log(result)
        res.json({msg:'An dummy email has been sent to your email',id:result.messageId})   
    }
    catch(err){
        console.log(err)
    }
}