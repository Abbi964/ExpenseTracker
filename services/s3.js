const AWS = require('aws-sdk')

exports.uploadToS3 = (data,filename)=>{
    return new Promise((resolve,reject)=>{
        // first making an AWSS3 instence 
        let s3Instence = new AWS.S3({
            accessKeyId:process.env.AWS_USER_KEY,
            secretAccessKey:process.env.AWS_USER_SECRET,
        })
        // now uploading to bucket 
        let params = {
            Bucket:process.env.AWS_BUCKET_NAME,
            Key:filename,
            Body:data,
            ACL:'public-read'
        }
        s3Instence.upload(params,(err,s3Response)=>{
            if(err){
                console.log('Error Happened',err)
                reject(err)
            }
            else{
                // console.log('sucessfull',s3Response)
                resolve(s3Response.Location) 
            }
        })

    })
}