const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const bcrypt = require("bcrypt");
const ManufacturerDetail = require("../model/manufacturer");
const authenticate = require("../middleware/authenticate")
const multer = require('multer');
const storage = require('../middleware/multer');

router.get('/' ,authenticate, (req,res,next)=>{
    res.render('manufacturersList',{layout:"main",title:"Manufacturer"})
})


router.get('/form/:id' ,async (req,res,next)=>{
    if(req.params.id == 'new')
    {
        //console.log(req.params.id);
        res.render('manufacturersForm',{layout:"main", mode:"create", title:"Maunfacturer Form"})
    }
    else
    {
        const manuf = await ManufacturerDetail.findById({_id:req.params.id})
        res.render('manufacturersForm',{layout:'main',title:'Edit Details', manufacturer:JSON.parse(JSON.stringify(manuf))})
    }
})


router.post('/upload' ,(req,res,next)=>{

    const newManufacturer = new ManufacturerDetail({
        name:req.body.manufacturername,
        slug:req.body.slug,
    });

    newManufacturer.save().then(res=>{
        console.log("Manufacturer created:" +res);
})
res.redirect("/manufacturers")
})

router.post('/update/:id' , (req,res,next)=>{
    const Manufacturer_id = req.params.id
    
    const UpdatedManufacturer ={
        name: req.body.manufacturername,
        slug:req.body.slug,
    }

    ManufacturerDetail.findOneAndUpdate({"_id":Manufacturer_id},UpdatedManufacturer).then(cb=>{
        res.redirect("/manufacturers")
    }).catch(err=>{
        console.log(err);
        res.send("Coudnt update the manufacturer")
    })
})


router.get('/autocomplete',(req,res)=>{
    var reg = new RegExp(req.query["term"],'i');
    var manufacturerFilter = ManufacturerDetail.find({name:reg},{'name':1}).sort({"updated_at":-1}).sort({"created_at":-1}).limit(20);
        manufacturerFilter.exec(function(err,data){
            console.log(data);
        var result=[];
        if(!err)
        {
            if(data && data.length && data.length>0)
            {
                data.forEach(manuf => {
                    let obj = {
                        id:manuf._id,
                        label:manuf.name,
                    };
                    console.log(obj);
                    result.push(obj);
                });
            }
            res.jsonp(result);
        }
    });
})



router.post('/manufacturerslist' , (req,res,next)=>{
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

    ManufacturerDetail.countDocuments({}).then(c =>{
        recordsTotal = c;
        console.log("count : " +c);

        ManufacturerDetail.countDocuments(searchStr).then(fc =>{
            recordsFiltered =fc;
            console.log("Filtered records:" +fc);

            let query = {}
            query.skip = parseInt(req.body.start);
            query.linit = parseInt(req.body.length);
            
            let manufacturerList = []
            ManufacturerDetail.find({}).then(manuf=>{
                for(var i=0; i<manuf.length;i++)
                {
                    manufacturerList.push({
                        "id":manuf[i]._id,
                        "name":manuf[i].name,
                        "slug":manuf[i].slug,
                        "manufacturerID":manuf[i].manufacturer_id,
                    });
                }

                res.json({draw: req.body.draw, recordsTotal: recordsTotal, data: manufacturerList})

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

router.get('/delete/:manufacturer_id', (req, res, next)=>{
    ManufacturerDetail.findById(req.params.manufacturer_id).then(manufacturer=>{
        ManufacturerDetail.findByIdAndDelete(req.params.manufacturer_id).then(result=>{
          //  res.redirect("/dashboard/users?delete=success");
          res.json({status: 200});
        }).catch(err=>{
         //   res.redirect("/dashboard/users?delete=error");
         res.json({status: 400});
        })
    })
})


module.exports= router;