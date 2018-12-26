const mongoose = require("mongoose");

const schema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  price: Number,
  amazonUrl: String,
  thumbUrl: String,
  category: String,
  isGift: Boolean,
  tags: String
});

module.exports = mongoose.model("Product", schema);
