const mongoose = require("mongoose");

const techSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  price: Number,
  amazonUrl: String,
  thumbUrl: String,
  category: String,
  isGift: Boolean,
  tags: String
});

const coffeeSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  price: Number,
  amazonUrl: String,
  thumbUrl: String,
  category: String
});

module.exports = {
  tech: mongoose.model("Product", techSchema),
  coffee: mongoose.model("CoffeeProduct", coffeeSchema)
};
