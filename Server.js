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
  //postProduct();
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

async function postProduct() {
  console.log(`Server listening on port ${port}!`);
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: "Boosted Mini S",
    minPrice: 600,
    thumbUrl: "",
    images: [],
    videos: [],
    versions: [],
    reviews: [],
    category: "gadgets"
  });
  product
    .save()
    .then(result => {
      console.log(result);
    })
    .catch(err => console.log(err));
}
*/
