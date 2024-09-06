// userSchema
const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    email:{
        type:String,
    },
    age:Number
})
module.exports = mongoose.model('users',userSchema);