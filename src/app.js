require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const connectDb = require("./config/database");

const authRouter = require("./routes/auth.routes");
const studentRoutes = require("./routes/student.routes");
const instructorRoutes = require("./routes/instructor.routes");
const adminRoutes = require("./routes/admin.routes");
const helmet = require("helmet");

const rateLimit = require("express-rate-limit");

const app = express();

app.use(helmet());
app.use(express.json());
app.use(cookieParser());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: "Too many requests, try again later",
});

app.use(limiter);

app.use("/", authRouter);
app.use("/student", studentRoutes);
app.use("/instructor", instructorRoutes);
app.use("/admin", adminRoutes);

const PORT = process.env.PORT || 9000;

connectDb()
  .then(() => {
    console.log("Connected to MongoDB");

    app.listen(PORT, () => {
      console.log("Server is running!");
      console.log(`Your clickable URL: http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Error: " + err);
  });