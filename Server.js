const express = require("express");
const mongoose = require("mongoose");
//const keys = require("./keys");
const Product = require("./Product.js");
const app = express();
const port = 3000;
app.listen(process.env.PORT || port, () =>
  console.log("server running on port " + port)
);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept,content-type,application/json"
  );
  next();
});

mongoose.connect(
  "mongodb://bsanie:" +
    (process.env.MONGO_PASSWORD || require("./keys").adminPassword) +
    "@mobilestore-shard-00-00-oardq.mongodb.net:27017,mobilestore-shard-00-01-oardq.mongodb.net:27017,mobilestore-shard-00-02-oardq.mongodb.net:27017/test?ssl=true&replicaSet=mobileStore-shard-0&authSource=admin&retryWrites=true",
  { useNewUrlParser: true, dbName: "storeIndex" }
);

app.get("/", (req, res) =>
  res
    .status(200)
    .send("endpoints: /getproductsbycat/:category, /getproductbyid/:id")
);

app.get("/getproductsbycat/:category/:sortingAlgo", (req, res) => {
  var category = req.params.category;
  Product.find({ category: category }, "name price thumbUrl amazonUrl")
    .exec()
    .then(docs => {
      if (docs.length == 0) {
        res.status(500).json({ error: "no products found" });
      } else {
        docs = sortDocs(docs, req.params.sortingAlgo);
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
  //res.status(200).send("posted");
  var { name, cat, thumbUrl, amazonUrl, price, isGift, tags } = req.query;
  postProduct(name, cat, thumbUrl, amazonUrl, price, isGift, tags, res);
});

async function postProduct(
  name,
  cat,
  thumbUrl,
  amazonUrl,
  price,
  isGift,
  tags,
  res
) {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
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
      res.status(200).send("posted");
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
}

function sortDocs(docs, algo) {
  if (algo == "alphabetical") {
    return docs.sort(function(a, b) {
      return a.name.localeCompare(b.name);
    });
  } else if (algo == "priceLowToHigh") {
    return docs.sort(function(a, b) {
      return a.price - b.price;
    });
  } else if (algo == "priceHighToLow") {
    return docs.sort(function(a, b) {
      return b.price - a.price;
    });
  }
}
