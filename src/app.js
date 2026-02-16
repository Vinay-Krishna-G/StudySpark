require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const connectDb = require("./config/database");
const authRouter = require("./routes/auth.routes");
const studentRoutes = require("./routes/student.routes");
const instructorRoutes = require("./routes/instructor.routes");
const adminRoutes = require("./routes/admin.routes");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/student", studentRoutes);
app.use("/instructor", instructorRoutes);
app.use("/admin", adminRoutes);

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