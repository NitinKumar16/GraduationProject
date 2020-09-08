var nodemailer = require("nodemailer")

const { 
    MAIL_PASS,
    MAIL_EMAIL
} = process.env;

//console.log(MAIL_EMAIL + "," +MAIL_PASS);

var transporter = nodemailer.createTransport({
    host:'smtp.gmail.com',
    port:587,
    //secure:false,
    auth:{
        user:MAIL_EMAIL,
        pass:MAIL_PASS,
    },
})
//getting one element
module.exports = (obj)=>{
    transporter.sendMail(obj ,(err,details) =>{
        console.log(details);
        console.log(obj);
        if(err)
        {
            return console.log('error' , JSON.stringify((err),{tags:'email'}));
        }
        else
        {
            return console.log('details' , JSON.stringify((details), {tags:'email'}));
        }
        
        transporter.close();
    });
};