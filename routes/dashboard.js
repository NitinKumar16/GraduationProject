const express = require("express");
const jwt = require ("jsonwebtoken");
const router = express.Router();
const bcrypt = require("bcrypt");
const authenticate = require("../middleware/authenticate")

router.get('/', authenticate,(req,res,next)=>{
    var userName =req.userData.name
    res.render('dashboard' , {layout:'main',title:'Admin Dashboard',name:userName})
});

module.exports = router;