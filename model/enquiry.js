const mongoose = require("mongoose")
var autoIncrement = require("mongoose-auto-increment")

var enquirySchema = new mongoose.Schema({

    name:{
        type:String,
        trim:true,
        required:true,
        maxlength:32,
    },
    
    Productid:{
        type:Number,
        trim:true,
        required:true,
        maxlength:3,
    },

    subject:{
        type:String,
        trim:true,
        required:true,
        maxlength:3000,
    },

    phoneno:{
        type:Number,
        required:true
    },

    email:{
        type:String,
        trim:true,
        maxlength:32,
        required:true,
        unique:true,
    },

    message:
    {
        type:String,
        required:true,
        trim:true,
        maxlength:10000,
    },

})


module.exports = new mongoose.model("EnquirySchema", enquirySchema)