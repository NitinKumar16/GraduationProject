var creds = require('../creds')
var path = require("path");
var Handlebars = require("handlebars")
var fs = require('fs');

const {
    RECIEVER_EMAIL
}=process.env



var source = fs.readFileSync(path.join(__dirname, 'indexMail.hbs'), 'utf8');

var template = Handlebars.compile(source)

var users = (email,data)=>{
    console.log(`Sending email to......${email}`);
    return {
        from: 'threeplus.dev@gmail.com',
        to: RECIEVER_EMAIL,
        subject: "Welocme to login Three plus please do not reply",
        html: template(data),
    }
}

module.exports=(email,data)=>{
    //passing 2 elements
    return creds(users(email,data));
}