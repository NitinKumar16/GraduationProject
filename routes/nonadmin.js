const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const ProductDetail = require("../model/product");
const CategoryDetail = require("../model/category")
const ManufacturerDetail = require("../model/manufacturer")
const EnquiryDetail = require("../model/enquiry")
const nodemailer = require("nodemailer");
const sendEmail = require("../helper/mailer/welcome/enquiryMail");

const { 
    RECIEVER_EMAIL
} = process.env;

router.get("/" , async (req,res)=>{
    products=await ProductDetail.find({}).lean()
    res.render("welcomeNonAdmin",{layout:'usermain',title:'Users Page',data:products})
})


router.get("/NonAdmincategory", async(req,res)=>{
    Prodcategories= await CategoryDetail.find({}).lean()
    res.render("nonAdminCategory",{layout:"usermain",title:"User Page",data:Prodcategories})
})

router.get("/NonAdminproducts/:slug" , async (req,res)=>{
    //var main=await ProductDetail.find()
//console.log(Object.assign({}));
        categoryInterested = req.params.slug
        //console.log(categoryInterested);
        products=await ProductDetail.find({"slug":categoryInterested}).lean()
        //console.log(products.name);
            res.render("nonAdminProducts",{layout:"usermain",title:"Category", data:products})
        })
        //var prod =JSON.parse(JSON.stringify(products))

/*router.get('/enquiryForm' , (req,res,next)=>{

})*/

router.get("/NonAdminManufacturers",async (req,res)=>{
    manuf=await ManufacturerDetail.find({}).lean()
    //console.log(manuf);
    res.render("nonAdminManufacturer",{layout:"usermain",title:"Manufacturer" , data: manuf})
})

router.post('/enquiryForm', (req,res,next)=>{

    const customerEnquiry = new EnquiryDetail({
        name:req.body.Contactname,
        Productid:req.body.Prodid,
        subject:req.body.Subject,
        phoneno:req.body.Phone,
        email:req.body.Email,
        message:req.body.Message
    })

    customerEnquiry.save().then(res=>{
        sendEmail( RECIEVER_EMAIL ,JSON.parse(JSON.stringify({
            name:req.body.Contactname,
            Productid:req.body.Prodid,
            subject:req.body.Subject,
            phoneno:req.body.Phone,
            email:req.body.Email,
            message:req.body.Message})));
    })
    res.render("nonAdminSuccess",{layout:"blank",title:"Success"})
})


module.exports = router