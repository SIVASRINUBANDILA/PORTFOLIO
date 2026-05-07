const mongoose = require("mongoose");

const schema = new mongoose.Schema({

id:Number,
title:String,
company:String,
duration:String,
desc:String

});

// Add indexes for faster queries
schema.index({ id: 1 });

module.exports = mongoose.model("Experience", schema);