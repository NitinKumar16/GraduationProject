const jwt = require("jsonwebtoken");
require('dotenv').config();
const {
    JWT_SECRET
}=process.env;

module.exports = (req,res,next) =>{
    try{
        const token = req.cookies['xfcv']
        console.log("token: "+token);
        if(token)
        {
            const decoded_token = jwt.verify(token,JWT_SECRET);
            req.userData={
                email:decoded_token.email,
                userId:decoded_token.userId,
                role:decoded_token.role,
                name:decoded_token.name
            }
            //console.log(userData.name)
            next();
        }
        else{
            res.render("404",{layout:"blank",title:"404 error"})
        }
    }
    catch(err){
        res.json({status:400, data:null, message:"User Authentication Failed"})
    }
}