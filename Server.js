const express = require("express");
const mongoose = require("mongoose");
//const keys = require("./keys");
const ProductsObj = require("./Product.js");
const Product = ProductsObj.tech;
const CoffeeProduct = ProductsObj.coffee;
const PriceFinder = require("price-finder");
const priceFinder = new PriceFinder();
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

app.get("/", async (req, res) => {
  // await priceFinder.findItemPrice(
  //   "https://www.amazon.com/gp/product/B077CZM19N?pf_rd_p=c2945051-950f-485c-b4df-15aac5223b10&pf_rd_r=E49SDRCTZWBXR3VKKYWG",
  //   function(err, value) {
  //     res.json(value);
  //   }
  // );
  res
    .status(200)
    .send(
      "endpoints: /getproductsbycat/:category/:sortBy/:order, /getgifts/:sortBy/:order, /getproductbyid/:id"
    );
});

app.get("/getproductsbycat", (req, res) => {
  var { category, sortBy, order, page } = req.query;
  var category = category;
  var sort = {};
  sort[sortBy] = order;
  Product.countDocuments({ category: category }, function(err, count) {
    if (err) throw err;
    Product.find({ category: category }, "name price thumbUrl amazonUrl")
      .sort(sort)
      .skip((page - 1) * 24)
      .limit(24)
      .exec()
      .then(docs => {
        if (docs.length == 0) {
          res.status(500).json({ error: "no products found" });
        } else {
          var out = {
            count: count,
            products: docs
          };
          res.status(200).json(out);
        }
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
      });
  });
});

app.get("/getgifts/:sortBy/:order", (req, res) => {
  var sort = {};
  sort[req.params.sortBy] = req.params.order;
  Product.countDocuments({ isGift: true }, function(err, count) {
    if (err) throw err;
    Product.find({ isGift: true }, "name price thumbUrl amazonUrl")
      .sort(sort)
      .exec()
      .then(docs => {
        if (docs.length == 0) {
          res.status(500).json({ error: "no products found" });
        } else {
          //var docArray = sortDocs(docs, req.params.sortingAlgo || "alphabetical");
          var out = {
            count: count,
            products: docs //docArray
          };
          res.status(200).json(out);
        }
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
      });
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

app.get("/postproduct", async function(req, res) {
  //res.status(200).send("posted");
  var { name, cat, thumbUrl, amazonUrl, price, isGift, tags } = req.query;
  await priceFinder.findItemPrice(amazonUrl, function(err, value) {
    if (err) console.log(err);
    price = value;
  });
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
