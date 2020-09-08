//product model config multer after this upload product pic

const mongoose = require ("mongoose");
var autoIncrement = require('mongoose-auto-increment')

var productSchema = new mongoose.Schema({

    name:
    {
        type:String,
        trim:true,
        required:true,
        maxlength:32,
    },
    slug:
    {
        type:String,
        require:true,
    },
    price:
    {
        type:Number,
        required:true,
        maxlength:32,
        trim:true,
    },
    description:
    {
        type:String,
        required:true,
        trim:true,
        maxlength:1000,
    },
    product_image:{
        type:String,
    },
})
autoIncrement.initialize(mongoose.connection);
productSchema.plugin(autoIncrement.plugin,
    {
        model:'product',
        field:'cat_id',
        startAt:100,
        incrementBy:1,
    });


module.exports = new mongoose.model('Product',productSchema)