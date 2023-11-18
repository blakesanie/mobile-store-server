const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const mongoose = require("mongoose");
//const keys = require("./keys");
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
    var records = [];
    const csvWriter = createCsvWriter({
      path: "products.csv",
      header: [
        {
          id: "id",
          title: "id"
        },
        {
          id: "availability",
          title: "availability"
        },
        {
          id: "condition",
          title: "condition"
        },
        {
          id: "description",
          title: "description"
        },
        {
          id: "image_link",
          title: "image_link"
        },
        {
          id: "link",
          title: "link"
        },
        {
          id: "title",
          title: "title"
        },
        {
          id: "price",
          title: "price"
        },
        {
          id: "brand",
          title: "brand"
        }
      ]
    });
    Product.find({})
      .then(async docs => {
        for (var doc of docs) {
          var obj = {};
          obj.id = doc._id;
          obj.availability = "in stock";
          obj.condition = "new";
          obj.description = "View to see more information on Amazon";
          obj.image_link = doc.thumbUrl;
          obj.link = doc.amazonUrl;
          obj.title = doc.name;
          obj.price = doc.price;
          obj.brand = doc.name;
          records.push(obj);
        }
        csvWriter.writeRecords(records).then(() => {
          console.log("...Done");
        });
      })
      .catch(err => {
        console.log(err);
      });
  });
// const csvWriter = createCsvWriter({
//   path: "products.csv",
//   header: [
//     {
//       id: "id",
//       availability: "availability",
//       condition: "condition",
//       description: "description",
//       image_link: "image_link",
//       link: "link",
//       title: "title",
//       price: "price",
//       brand: "brand"
//     },
//     { id: "lang", title: "LANGUAGE" }
//   ]
// // });
// mongoose
//   .connect(
//     "mongodb://bsanie:" +
//       (process.env.MONGO_PASSWORD || require("./keys").adminPassword) +
//       "@mobilestore-shard-00-00-oardq.mongodb.net:27017,mobilestore-shard-00-01-oardq.mongodb.net:27017,mobilestore-shard-00-02-oardq.mongodb.net:27017/test?ssl=true&replicaSet=mobileStore-shard-0&authSource=admin&retryWrites=true",
//     { useNewUrlParser: true, dbName: "storeIndex" }
//   )
//   .then(() => {
//     Product.find({}, "amazonUrl")
//       .then(docs => {
//         for (var doc of docs) {
//           console.log(doc);
//         }
//       })
//       .catch(err => {
//         console.log("err:");
//         console.log(err);
//       });
//   });
//
// // csvWriter
// //   .writeRecords(records) // returns a promise
// //   .then(() => {
// //     console.log("...Done");
// //   });
//
// // This will produce a file path/to/file.csv with following contents:
// //
// //   NAME,LANGUAGE
// //   Bob,"French, English"
// //   Mary,English
