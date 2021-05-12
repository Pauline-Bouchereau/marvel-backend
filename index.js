require("dotenv").config();
const express = require("express");
const formidable = require("express-formidable");
//const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(formidable());
app.use(cors());

const characterRoutes = require("./routes/character");
const comicsRoutes = require("./routes/comics");
app.use(characterRoutes);
app.use(comicsRoutes);

app.get("/", (req, res) => {
  res
    .status(200)
    .json({ message: " Bienvenue sur mon projet backend Marvel !" });
});

app.all("*", (req, res) => {
  res.status(404).json({ message: "This page doesn't exist" });
});

app.listen(process.env.PORT, () => {
  console.log("Server started !");
});
