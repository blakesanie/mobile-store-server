const mongoose = require("mongoose");
//const keys = require("./keys");
const ProductsObj = require("./Product.js");
const Product = ProductsObj.tech;
const CoffeeProduct = ProductsObj.coffee;
const PriceFinder = require("price-finder");
const priceFinder = new PriceFinder();

var documents;

mongoose
  .connect(
    "mongodb://bsanie:" +
      (process.env.MONGO_PASSWORD || require("./keys").adminPassword) +
      "@mobilestore-shard-00-00-oardq.mongodb.net:27017,mobilestore-shard-00-01-oardq.mongodb.net:27017,mobilestore-shard-00-02-oardq.mongodb.net:27017/test?ssl=true&replicaSet=mobileStore-shard-0&authSource=admin&retryWrites=true",
    { useNewUrlParser: true, dbName: "storeIndex" }
  )
  .then(() => {
    Product.find({}, "amazonUrl")
      .then(async docs => {
        documents = docs;
        updatePriceForIndex(0);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
      });
  });

function updatePriceForIndex(i) {
  if (i == documents.length) {
    console.log("price update complete");
    return;
  }
  var doc = documents[i];
  var amazonUrl = doc.amazonUrl;
  // console.log("before: " + amazonUrl);
  var refIndex = amazonUrl.lastIndexOf("/ref");
  if (refIndex != -1) {
    amazonUrl = amazonUrl.substring(0, refIndex);
  }
  // console.log("after: " + amazonUrl);
  priceFinder.findItemDetails(amazonUrl, function(err, value) {
    if (!err) {
      // console.log(doc);
      // console.log(value);
      doc.price = Math.floor(value.price);
      if (value.price != 0 && value.price < 2000) {
        doc.save(function(err, newDoc) {
          if (err) throw err;
          console.log(i + " / " + documents.length);
          updatePriceForIndex(i + 1);
        });
      }
    } else {
      console.log(err);
      updatePriceForIndex(i + 1);
    }
  });
}
