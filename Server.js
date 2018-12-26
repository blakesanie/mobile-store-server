const express = require("express");
const mongoose = require("mongoose");
//const keys = require("./keys");
const Product = require("./Product.js");
const app = express();
const port = 3000;
app.listen(process.env.PORT || port, () =>
  console.log("server running on port " + port)
);

mongoose.connect(
  "mongodb://bsanie:" +
    (process.env.MONGO_PASSWORD || require("./keys").adminPassword) +
    "@mobilestore-shard-00-00-oardq.mongodb.net:27017,mobilestore-shard-00-01-oardq.mongodb.net:27017,mobilestore-shard-00-02-oardq.mongodb.net:27017/test?ssl=true&replicaSet=mobileStore-shard-0&authSource=admin&retryWrites=true",
  { useNewUrlParser: true, dbName: "storeIndex" }
);

app.get("/", (req, res) => res.send("Hello World!"));

app.get("/getproductsbycat/:category", (req, res) => {
  var category = req.params.category;
  Product.find({ category: category }, "_id name minPrice thumbUrl")
    .exec()
    .then(docs => {
      if (docs.length == 0) {
        res.status(500).json({ error: "no products found" });
      } else {
        res.status(200).json(docs);
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

app.get("/getproductbyid/:id", (req, res) => {
  var id = req.params.id;
  Product.find({ _id: id })
    .exec()
    .then(docs => {
      if (docs.length == 0) {
        res.status(500).json({ error: "no products found" });
      } else {
        res.status(200).json(docs);
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

app.get("/postproduct", function(req, res) {
  var { name, cat, thumbUrl, amazonUrl, price, isGift, tags } = req.query;
  postProduct(name, cat, thumbUrl, amazonUrl, price, isGift, tags);
  res.status(200).send("posted");
});

async function postProduct(
  name,
  cat,
  thumbUrl,
  amazonUrl,
  price,
  isGift,
  tags
) {
  const product = new Product({
    _id: mongoose.Schema.Types.ObjectId,
    name: name,
    price: price,
    amazonUrl: amazonUrl,
    thumbUrl: thumbUrl,
    category: cat,
    isGift: isGift,
    tags: tags
  });
  product
    .save()
    .then(result => {
      console.log("posted to Mongo");
      console.log(result);
    })
    .catch(err => console.log(err));
}
