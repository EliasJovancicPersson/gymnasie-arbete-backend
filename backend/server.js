const express = require("express");
const colors = require("colors");
const dotenv = require("dotenv").config();
const { errorHandler } = require("./middleware/errorMiddleware");
const connectDB = require("./config/db");
const port = process.env.PORT || 5000;
const multer = require("multer");
const upload = multer();

connectDB();

const app = express();

app.all("/", function (req, res, next) {
  res.set({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "content-type",
  });
  next();
});
app.use(express.json());
app.use(upload.array("files")); //creates req.files array

app.use("/wiki", require("./routes/projRoutes"));

app.use(errorHandler);

app.listen(port, () => {
  console.log(`server started on port ${port}`);
});
