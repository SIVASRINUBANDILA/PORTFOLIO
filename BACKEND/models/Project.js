const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({

id:Number,
title:String,
tech:String,
desc:String,
link:String

});

// Add indexes for faster queries
projectSchema.index({ id: 1 });
projectSchema.index({ title: 1 });

module.exports = mongoose.model("Project", projectSchema);