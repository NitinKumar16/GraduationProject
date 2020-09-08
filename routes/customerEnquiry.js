const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const ProductDetail = require("../model/product");
const EnquiryDetail = require("../model/enquiry");

router.get("/",  (req,res)=>{
    res.render("enquiryRecords",{layout:"main",title:"Enquiry Records"})
})

router.post("/enquirylist" , (req,res,next)=>{
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

    EnquiryDetail.countDocuments({}).then(c =>{
        recordsTotal = c;
        console.log("count : " +c);

        EnquiryDetail.countDocuments(searchStr).then(fc =>{
            recordsFiltered =fc;
            console.log("Filtered records:" +fc);

            let query = {}
            query.skip = parseInt(req.body.start);
            query.linit = parseInt(req.body.length);
            
            let eList = []
            EnquiryDetail.find({}).then(enquiry=>{
                for(var i=0; i<enquiry.length;i++)
                {
                    eList.push({
                        "id":enquiry[i]._id,
                        "name":enquiry[i].name,
                        "productid":enquiry[i].Productid,
                        "email":enquiry[i].email,
                        //"enquiryno":enquiry[i].enquiry_no,
                    });
                }

                res.json({draw: req.body.draw, recordsTotal: recordsTotal, data: eList})

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

router.get('/view/:id' ,async (req,res)=>{
    const Enqdetails = await EnquiryDetail.findById(req.params.id).lean()
    //res.render('EnquiryDetails',{layout:'main',title:Enqdetails})
    console.log(Enqdetails.Productid);

    const ProductEnquiry = Enqdetails.Productid;
    Product = await ProductDetail.find({"cat_id":ProductEnquiry}).lean()
    console.log(Product)

    res.render("enquiryView",{layout:"main",title:Enqdetails.name, Enquirydata:JSON.parse(JSON.stringify(Enqdetails)), Productdata:Product})
})

router.get('/delete/:enquiry_id', (req, res, next)=>{
    EnquiryDetail.findById(req.params.enquiry_id).then(enquiry=>{
        EnquiryDetail.findByIdAndDelete(req.params.enquiry_id).then(enquiry=>{
          //  res.redirect("/dashboard/users?delete=success");
          res.json({status: 200});
        }).catch(err=>{
         //   res.redirect("/dashboard/users?delete=error");
         res.json({status: 400});
        })
    })
})


module.exports= router;