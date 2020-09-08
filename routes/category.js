const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const bcrypt = require("bcrypt");
const CategoryDetail = require("../model/category");
const authenticate = require("../middleware/authenticate")
const multer = require('multer');
const storage = require('../middleware/multer');

router.get('/' ,authenticate, (req,res,next)=>{
    res.render('categoryList',{layout:"main",title:"Categories"})
})


router.get('/form/:id' ,async (req,res,next)=>{
    if(req.params.id == 'new')
    {
        //console.log(req.params.id);
        res.render('categoryForm',{layout:"main", mode:"create", title:"Category Form"})
    }
    else
    {
        const category = await CategoryDetail.findById({_id:req.params.id})
        res.render('categoryForm',{layout:'main',title:'Edit Details', category:JSON.parse(JSON.stringify(category))})
    }
})

router.post('/upload' ,(req,res,next)=>{

    const newCategory = new CategoryDetail({
        name:req.body.categoryname,
        slug:req.body.slug,
    });

    newCategory.save().then(res=>{
        console.log("Category created:" +res);
})
res.redirect("/category")
})


router.post('/update/:id' , (req,res,next)=>{
    const Category_id = req.params.id
    
    const UpdatedCategory ={
        name: req.body.categoryname,
        slug:req.body.slug,
    }

    CategoryDetail.findOneAndUpdate({"_id":Category_id},UpdatedCategory).then(cb=>{
        res.redirect("/category")
    }).catch(err=>{
        console.log(err);
        res.send("Couldn't update the category")
    })
})


router.get('/autocomplete',(req,res)=>{
    var reg = new RegExp(req.query["term"],'i');
    var categoryFilter = CategoryDetail.find({name:reg},{'name':1}).sort({"updated_at":-1}).sort({"created_at":-1}).limit(20);
        categoryFilter.exec(function(err,data){
            console.log(data);
        var result=[];
        if(!err)
        {
            if(data && data.length && data.length>0)
            {
                data.forEach(cat=> {
                    let obj = {
                        id:cat._id,
                        label:cat.name,
                    };
                    console.log(obj);
                    result.push(obj);
                });
            }
            res.jsonp(result);
        }
    });
})



router.post('/categorieslist' , (req,res,next)=>{
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

    CategoryDetail.countDocuments({}).then(c =>{
        recordsTotal = c;
        console.log("count : " +c);

        CategoryDetail.countDocuments(searchStr).then(fc =>{
            recordsFiltered =fc;
            console.log("Filtered records:" +fc);

            let query = {}
            query.skip = parseInt(req.body.start);
            query.linit = parseInt(req.body.length);
            
            let categoryList = []
            CategoryDetail.find({}).then(category=>{
                for(var i=0; i<category.length;i++)
                {
                    categoryList.push({
                        "id":category[i]._id,
                        "name":category[i].name,
                        "slug":category[i].slug,
                        "categoryID":category[i].cat_id,
                    });
                }

                res.json({draw: req.body.draw, recordsTotal: recordsTotal, data: categoryList})

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

router.get('/delete/:category_id', (req, res, next)=>{
    CategoryDetail.findById(req.params.category_id).then(product=>{
        CategoryDetail.findByIdAndDelete(req.params.category_id).then(result=>{
          //  res.redirect("/dashboard/users?delete=success");
          res.json({status: 200});
        }).catch(err=>{
         //   res.redirect("/dashboard/users?delete=error");
         res.json({status: 400});
        })
    })
})



module.exports = router;