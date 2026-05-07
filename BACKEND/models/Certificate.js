const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  id: Number,
  title: String,
  category: String,
  icon: String,
  pdfUrl: String
});

// Add indexes for faster queries
schema.index({ id: 1 });

module.exports = mongoose.model("Certificate", schema);