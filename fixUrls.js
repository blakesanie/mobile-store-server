const mongoose = require("mongoose");
const ProductsObj = require("./Product.js");
const Product = ProductsObj.tech;

mongoose
  .connect(
    "mongodb://bsanie:" +
      (process.env.MONGO_PASSWORD || require("./keys").adminPassword) +
      "@mobilestore-shard-00-00-oardq.mongodb.net:27017,mobilestore-shard-00-01-oardq.mongodb.net:27017,mobilestore-shard-00-02-oardq.mongodb.net:27017/test?ssl=true&replicaSet=mobileStore-shard-0&authSource=admin&retryWrites=true",
    { useNewUrlParser: true, dbName: "storeIndex" }
  )
  .then(() => {
    var i = 0;
    Product.find({}, "amazonUrl")
      .then(async docs => {
        for (var doc of docs) {
          if (!doc.amazonUrl.includes("tag=bsanie00-20")) {
            var refIndex = doc.amazonUrl.lastIndexOf("/ref");
            if (refIndex != -1) {
              doc.amazonUrl = doc.amazonUrl.substring(0, refIndex);
            }
            doc.amazonUrl = doc.amazonUrl + "?tag=bsanie00-20";
            //console.log(doc.amazonUrl);
            doc.save(function(err, newDoc) {
              if (err) throw err;
              console.log(newDoc);
              i++;
            });
          }
        }
        console.log("Changed: " + i + "\nTotal: " + docs.length);
      })
      .catch(err => {
        console.log(err);
      });
  });
