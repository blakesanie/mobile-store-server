const mongoose = require("mongoose");
//const keys = require("./keys");
const ProductsObj = require("./Product.js");
const Product = ProductsObj.tech;
const CoffeeProduct = ProductsObj.coffee;

mongoose
  .connect(
    "mongodb://bsanie:" +
      (process.env.MONGO_PASSWORD || require("./keys").adminPassword) +
      "@mobilestore-shard-00-00-oardq.mongodb.net:27017,mobilestore-shard-00-01-oardq.mongodb.net:27017,mobilestore-shard-00-02-oardq.mongodb.net:27017/test?ssl=true&replicaSet=mobileStore-shard-0&authSource=admin&retryWrites=true",
    { useNewUrlParser: true, dbName: "storeIndex" }
  )
  .then(() => {
    Product.update(
      { category: "accessories" },
      { category: "gadgets" },
      { multi: true },
      function(err, raw) {
        if (err) return handleError(err);
        console.log("The raw response from Mongo was ", raw);
      }
    );
  });
