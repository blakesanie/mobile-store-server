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
    process.env.MONGO_PASSWORD +
    "@mobilestore-shard-00-00-oardq.mongodb.net:27017,mobilestore-shard-00-01-oardq.mongodb.net:27017,mobilestore-shard-00-02-oardq.mongodb.net:27017/test?ssl=true&replicaSet=mobileStore-shard-0&authSource=admin&retryWrites=true",
  { useNewUrlParser: true, dbName: "storeIndex" }
);

app.get("/", (req, res) => res.send("Hello World!"));

app.get("/getproductsbycat/:category", (req, res) => {
  var category = req.params.category;
  Product.find({ category: category })
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
  var {
    name,
    cat,
    thumbUrl,
    photos,
    videos,
    versions,
    minPrice,
    reviews
  } = req.query;
  photos = JSON.parse(photos);
  videos = JSON.parse(videos);
  versions = JSON.parse(versions);
  reviews = JSON.parse(reviews);
  postProduct(name, minPrice, thumbUrl, photos, videos, versions, reviews, cat);
  res.status(200).send("posted");
});

async function postProduct(
  name,
  minPrice,
  thumbUrl,
  photos,
  videos,
  versions,
  reviews,
  category
) {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: name,
    minPrice: minPrice,
    thumbUrl: thumbUrl,
    images: photos,
    videos: videos,
    versions: versions,
    reviews: reviews,
    category: category
  });
  product
    .save()
    .then(result => {
      console.log("posted to Mongo");
      console.log(result);
    })
    .catch(err => console.log(err));
}
