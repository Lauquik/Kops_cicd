const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config();
const fileUpload = require("express-fileupload");

app.use(fileUpload());

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

app.get("/api/items", async (req, res) => {
  try {
    const itemlist = await items.find(); // Fetch items from MongoDB
    res.json(itemlist);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/upload", async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }

  let uploadedFile = req.files.file; // Assuming "file" is the field name in your form

  try {
    const data = JSON.parse(uploadedFile.data.toString("utf8"));
    await items.insertMany(data);
    res.status(200).send("File uploaded and data imported successfully!");
  } catch (error) {
    res.status(500).send("Error importing data.");
  }
});

app.use(express.static(path.join(__dirname, "./build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./build/index.html"));
});

app.listen(3000, () => {
  console.log("Listening on port 3000.....");
});
