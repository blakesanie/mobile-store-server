const express = require("express");
const mongoose = require("mongoose");
const keys = require("./keys");
const Product = require("./Product.js");
const app = express();
const port = 3000;

mongoose.connect(
  "mongodb://bsanie:" +
    keys.adminPassword +
    "@mobilestore-shard-00-00-oardq.mongodb.net:27017,mobilestore-shard-00-01-oardq.mongodb.net:27017,mobilestore-shard-00-02-oardq.mongodb.net:27017/test?ssl=true&replicaSet=mobileStore-shard-0&authSource=admin&retryWrites=true",
  { useNewUrlParser: true }
);

app.get("/", (req, res) => res.send("Hello World!"));

app.listen(port, () => postProduct());

async function postProduct() {
  console.log(`Server listening on port ${port}!`);
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: "second product",
    price: 999
  });
  product
    .save()
    .then(result => {
      console.log(result);
    })
    .catch(err => console.log(err));
}
