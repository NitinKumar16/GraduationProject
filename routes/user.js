const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const bcrypt = require("bcrypt");
const UserDetail = require("../model/user");
const authenticate = require("../middleware/authenticate")
//const logoutcontroller = require("../middleware/logoutcontroller")
const xlsx = require('xlsx');
const multer = require('multer');
const storage = require('../middleware/multer');
const user = require("../model/user");


router.get("/",authenticate, (req,res,next)=>{
    res.render("userList", {layout:"main",title:"User List"})
})

router.get("/form/:uid", authenticate, async(req,res,next)=>{
    if(req.params.uid == 'new')
    {
        res.render("userForm", {layout:"main", mode:"create",title:"User Registration"})
    }
    else
    {
        const user = await UserDetail.findById({_id:req.params.uid})
        res.render("userForm", {layout:"main", mode:"edit", title:"Edit User", user:JSON.parse(JSON.stringify(user))})
    }

})

router.post("/upload" , async (req,res)=>{
    try{
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(req.body.password,salt)
        
        const newuser = new UserDetail ({
            name:req.body.name,
            email:req.body.email,
            password:hashedPassword,
            age:req.body.age,
            role:req.body.role,
        })

        newuser.save().then(res =>{
            console.log("User data created");
        })
        res.redirect("/users")
    }
    catch{
        res.send("cannot create following user")
    }
})

router.get('/autocomplete',(req,res)=>{
    var reg = new RegExp(req.query["term"],'i');
    var userFilter =UserDetail.find({name:reg},{'name':1}).sort({"updated_at":-1}).sort({"created_at":-1}).limit(20);
    userFilter.exec(function(err,data){
            //console.log(data);
        var result=[];
        if(!err)
        {
            if(data && data.length && data.length>0)
            {
                data.forEach(users => {
                    let obj = {
                        id:users._id,
                        label:users.name,
                    };
                    console.log(obj);
                    result.push(obj);
                });
            }
            res.jsonp(result);
        }
    });
})

router.post('/update/:uid' ,async (req,res)=>{
    const user_id = req.params.uid
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt)
    console.log(salt , hashedPassword , req.body.password);
    
    const UpdatedUser ={
        name:req.body.name,
        email:req.body.email,
        password:hashedPassword,
        age:req.body.age,
        role:req.body.role,
    }

    UserDetail.findOneAndUpdate({"_id":user_id},UpdatedUser).then(cb=>{
        res.redirect("/users")
    }).catch(err=>{
        console.log(err);
        res.send("Coudnt update the user")
    })

})


router.post("/userlist" , (req,res,next)=>{
    var searchStr = req.body.search.value;
    if(req.body.search.value)
    {
        var regex = new RegExp(req.body.search.value, "i");
        searchStr = {$or:[{'_id':regex},{'city':regex},{'state':regex}]};
    }
    else
    {
        searchStr={}
    }

    var recordsTotal = 0;
    var recordsFiltered = 0;

    UserDetail.countDocuments({}).then(c =>{
        recordsTotal = c;
        console.log("count : " +c);

        UserDetail.countDocuments(searchStr).then(fc =>{
            recordsFiltered =fc;
            console.log("Filtered records:" +fc);

            let query = {}
            query.skip = parseInt(req.body.start);
            query.linit = parseInt(req.body.length);
            
            let userList = []
            UserDetail.find({}).then(users=>{
                for(var i=0; i<users.length;i++)
                {
                    userList.push({
                        "id":users[i]._id,
                        "email":users[i].email,
                        "name":users[i].name,
                        "role":users[i].role,
                        "categoryID":users[i].cat_id,
                    });
                }

                res.json({draw: req.body.draw, recordsTotal: recordsTotal, data: userList})

            }).catch(err=>{
                console.log(err);
            })
        }).catch(err=>{
            console.log(err);
        })
    }).catch(err=>{
        console.log(err);
    })
})

//router.get('/logout', logoutcontroller.logout_get)
module.exports=router;