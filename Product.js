const mongoose = require("mongoose");

const schema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  minPrice: Number,
  thumbUrl: String,
  images: Array,
  videos: Array,
  versions: Array,
  reviews: Array,
  category: String
});

module.exports = mongoose.model("Product", schema);
