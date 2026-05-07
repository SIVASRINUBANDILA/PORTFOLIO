const mongoose = require("mongoose");

const schema = new mongoose.Schema({

name:String,
title:String,
location:String,
email:String,
phone:String,
photo:String,
bio:String,
resume:String,
exp:String,
github:String,
linkedin:String,
twitter:String,
website:String,
skills:[String]

});

// Add indexes for faster queries
schema.index({ name: 1 });

module.exports = mongoose.model("Profile", schema);