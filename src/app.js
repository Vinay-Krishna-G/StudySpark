require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser")
const connectDb = require("./config/database");
const authRouter = require("./routes/auth");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter)
            
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
