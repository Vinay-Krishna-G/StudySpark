require("dotenv").config();
const mongoose = require("mongoose");

const connectDb = async () => {
  await mongoose.connect(
    process.env.DB_URI
  );
};

module.exports = connectDb;
