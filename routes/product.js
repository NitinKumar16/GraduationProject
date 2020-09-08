const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const bcrypt = require("bcrypt");
const ProductDetail = require("../model/product");
const authenticate = require("../middleware/authenticate")
const multer = require('multer');
const storage = require('../middleware/multer');

router.get('/',authenticate,(req,res,next)=>{
    res.render('productList',{layout:'main',title:'Products'})
})

router.get("/form/:id", authenticate , async(req,res,next)=>{
    if(req.params.id == 'new')
    {
        console.log(req.params.id);
        res.render("productForm", {layout:"main", mode:"create", title:"Product Registration"})

    }
    else
    {
        console.log(req.params.id);
        const prod = await ProductDetail.findById({_id:req.params.id})
        console.log(prod);
        res.render("productForm", {layout:"main", mode:"edit", title:"Edit Product", product: JSON.parse(JSON.stringify(prod))})
    }

})

router.post('/upload' , multer({storage: storage}).single('product_image'/*from the hbs file of product*/),(req, res, next)=>{

        const newProduct = new ProductDetail();
            newProduct.name=req.body.productname,
            newProduct.slug=req.body.slug,
            newProduct.price=req.body.price,
            newProduct.description=req.body.description,
            newProduct.product_image=req.file.filename,

        newProduct.save().then(res=>{
            console.log("Product created:" +res);
            
        })
        res.redirect("/products")
})


router.post('/update/:id',multer({storage: storage}).single('product_image'), async (req,res,next)=>{
    const Product_id = req.params.id
    let update={}
    if(req.body.productname)
    {
        update['name']=req.body.productname
    }
    if(req.body.slug)
    {
        update['slug']=req.body.slug
    }
    if(req.body.price)
    {
        update['price']=req.body.price
    }
    if(req.body.description)
    {
        update['description']=req.body.description
    }
    if(req.file)
    {
        update['product_image']="/misc/"+req.file.filename
    }

    console.log("img:",+update.product_image);

    ProductDetail.findOneAndUpdate({"_id":Product_id},update,{new:true}).then(cb=>{
        res.redirect("/products")
    }).catch(err=>{
        console.log(err);
        res.send("Coudnt update the user")
    })
})

router.get('/autocomplete',(req,res)=>{
    var reg = new RegExp(req.query["term"],'i');
    var productFilter =ProductDetail.find({name:reg},{'name':1}).sort({"updated_at":-1}).sort({"created_at":-1}).limit(20);
    productFilter.exec(function(err,data){
            console.log(data);
        var result=[];
        if(!err)
        {
            if(data && data.length && data.length>0)
            {
                data.forEach(product => {
                    let obj = {
                        id:product._id,
                        label:product.name,
                    };
                    console.log(obj);
                    result.push(obj);
                });
            }
            res.jsonp(result);
        }
    });
})


router.post('/productlist',(req,res)=>{
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

    ProductDetail.countDocuments({}).then(c =>{
        recordsTotal = c;
        console.log("count : " +c);

        ProductDetail.countDocuments(searchStr).then(fc =>{
            recordsFiltered =fc;
            console.log("Filtered records:" +fc);

            let query = {}
            query.skip = parseInt(req.body.start);
            query.linit = parseInt(req.body.length);
            
            let productList = []
            ProductDetail.find({}).then(prod=>{
                for(var i=0; i<prod.length;i++)
                {
                    productList.push({
                        "id":prod[i]._id,
                        "name":prod[i].name,
                        "price":prod[i].price,
                        "slug":prod[i].slug,
                        "categoryID":prod[i].cat_id,
                    });
                }

                res.json({draw: req.body.draw, recordsTotal: recordsTotal, data: productList})

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

router.get('/delete/:product_id', (req, res, next)=>{
    ProductDetail.findById(req.params.product_id).then(product=>{
        ProductDetail.findByIdAndDelete(req.params.product_id).then(result=>{
          //  res.redirect("/dashboard/users?delete=success");
          res.json({status: 200});
        }).catch(err=>{
         //   res.redirect("/dashboard/users?delete=error");
         res.json({status: 400});
        })
    })
})

module.exports= router;