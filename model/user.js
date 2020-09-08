var mongoose = require("mongoose")

var userSchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:true,
        maxlength:20,
    },
    email:{
        type:String,
        trim:true,
        maxlength:32,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        trim:true,
        maxlength:500,
        required:true,
    },
    age:{
        type:Number,
        trim:true,
        required:true,
    },

    role:{
        type:String,
    }

},{timestamps:true})

module.exports = new mongoose.model('User',userSchema);