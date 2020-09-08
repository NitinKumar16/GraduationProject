const jwt = require('jsonwebtoken');
const { 
    JWT_SECRET
  } = process.env;

module.exports = (req, res, next)=>{
    try{
        const token = req.cookies['xfcv'];
        // console.log("token ", token);
        
        const decodedToken = jwt.verify(token, JWT_SECRET);
        // console.log("decoded_token ",decodedToken);
        
        req.userData= {
            email:decodedToken.email,
            userId:decodedToken.userId,
            role: decodedToken.role
        }
        // in future, check role and redirect admin to dashboard and users to frontend.
        res.redirect("/dashboard");
    }
    catch(err){

        next();
    }   
}