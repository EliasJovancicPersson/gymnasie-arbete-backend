const express = require("express");
const colors = require("colors");
const dotenv = require("dotenv").config();
const { ErrorHandler } = require("./middleware/errorMiddleware");
const { CheckFiles } = require("./middleware/checkFileMiddleware");
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
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use("/", require("./routes/userRoutes"));

app.post("/wiki", upload.array("files")); //creates req.files array

app.post("/wiki", CheckFiles);

app.use("/wiki", require("./routes/projRoutes"));

app.use(ErrorHandler);

app.listen(port, () => {
  console.log(`server started on port ${port}`);
});
