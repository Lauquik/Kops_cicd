const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config();

const Schema = new mongoose.Schema({
  id: Number,
  name: String,
  brand: String,
  size: String,
  occasion: String,
  color: String,
  saleDiscount: Number,
  price: {
    type: Number,
    required: true,
    float: true,
  },
  rating: Number,
  image: String,
});

const items = mongoose.model("Shoppingdata", Schema);

async function main() {
  await mongoose
    .connect(
      `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/test`
    )
    .then(() => {
      console.log("db connected");
    })
    .catch((e) => {
      console.log(e);
    });
}

main();

app.use(express.static(path.join(__dirname, "./build")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./build/index.html"));
});

app.get("/api/items", async (req, res) => {
  try {
    const itemlist = await items.find(); // Fetch items from MongoDB
    res.json(itemlist);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.listen(3000, () => {
  console.log("Listening on port 3000.....");
});
