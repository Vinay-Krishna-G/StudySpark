require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const connectDb = require("./config/database");
const authRouter = require("./routes/auth");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);

const PORT = process.env.PORT || 9000; //

connectDb()
  .then(() => {
    console.log("Connected to MongoDB"); //
    
    app.listen(PORT, () => {
      console.log(`Server is running!`);
      console.log(`Your clickable URL: http://localhost:${PORT}`); 
    });
  })
  .catch((err) => {
    console.log("Error: " + err); //
  });