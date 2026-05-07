const mongoose = require("mongoose");

const schema = new mongoose.Schema({

id:Number,
name:String,
email:String,
subject:String,
message:String,
time:String,
read:Boolean

});

module.exports = mongoose.model("Message", schema);