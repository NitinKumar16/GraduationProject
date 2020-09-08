const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const bcrypt = require("bcrypt");
const Users = require("../model/user");
const authenticate = require("../middleware/authenticate")
const checkLogin = require('../middleware/check-login')

require('dotenv').config();
const{
    JWT_SECRET
}=process.env;

router.get("/" , checkLogin,(req,res,next)=>{
    res.render("login", {layout:"blank", title:"Admin login"})
})

router.post("/", checkLogin, async(req,res,next)=>{
    const username=req.body.username;
    const password = req.body.password;

    console.log("Username: "+username, "Password:" +password);
    
    Users.findOne({email:req.body.username}).then(user=>{
        if(user)
        {
            console.log(user);
            bcrypt.compare(req.body.password, user.password).then(isMatched=>{
                if(isMatched)
                {
                    const payloadData =
                    {
                        id:user._id,
                        name:user.name,
                        email:user.email,
                        age:user.age,
                        role:user.role,
                    };
                    const token =  jwt.sign(
                        payloadData ,JWT_SECRET
                    );
                    console.log(token);
                    res.cookie('xfcv', token);
                    if(user.role==="admin")
                    {
                        res.redirect("/dashboard");
                    }
                    else
                    {
                        res.send("Not Authorised to enter beyond this point")
                    }
                }
                else
                {
                    res.send("denied")
                }
            })
        }
        else
        {
            res.render("404",{layout:"blank",title:"Ooops 404"})
        }
    }).catch(err=>{
        res.send("Cannot find the specific email id")
    })
})

module.exports=router;