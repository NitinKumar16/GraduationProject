//manufacturer model config multer after this upload manu facturer profile pic

const mongoose = require("mongoose")
var autoIncrement = require("mongoose-auto-increment")

var manufacturerSchema = new mongoose.Schema({
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
manufacturerSchema.plugin(autoIncrement.plugin,{
    model:'manufacturer',
    field:'manufacturer_id',
    startAt:100,
    incrementBy:1,
})

module.exports = new mongoose.model('Manufacturer',manufacturerSchema)