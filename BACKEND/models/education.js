const mongoose = require("mongoose");

const schema = new mongoose.Schema({

id:Number,
title:String,
place:String,
year:String,
grade:String

});

// Add indexes for faster queries
schema.index({ id: 1 });

module.exports = mongoose.model("Education", schema);