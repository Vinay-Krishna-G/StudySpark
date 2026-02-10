require("dotenv").config();
const express = require("express");
const connectDb = require("./config/database");

const app = express();

const PORT = process.env.PORT || 3000
connectDb()
  .then(() => {
    console.log("connected to mongoDB");
    app.listen(PORT, () => {
      console.log("Server running on port " + PORT);
    });
  })
  .catch((err) => {
    console.log("Error: " + err);
  });
