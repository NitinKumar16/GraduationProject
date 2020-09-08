const mongoose = require("mongoose");
var autoIncrement = require('mongoose-auto-increment');

var categorySchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:true,
        maxlength:32,
    },
    slug:{
        type:String,
        require:true,
    },
})

autoIncrement.initialize(mongoose.connection);

categorySchema.plugin(autoIncrement.plugin,
    {
        model:'category',
        field:'cat_id',
        startAt:100,
        incrementBy:1,
    });

module.exports = new mongoose.model('Category',categorySchema)