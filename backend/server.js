const express = require("express");
const colors = require("colors");
const dotenv = require("dotenv").config();
const { ErrorHandler } = require("./middleware/errorMiddleware");
const { CheckFiles } = require("./middleware/checkFileMiddleware");
const connectDB = require("./config/db");
const port = process.env.PORT || 5000;
const multer = require("multer");
const upload = multer();
const verifyToken = require("./middleware/authJWT"); //use this to ensure all users are logged in before sending a response/ if no token is present it will return status:500

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

app.post("/wiki", verifyToken, upload.array("files"), CheckFiles); //creates req.files array

app.use("/wiki", require("./routes/projRoutes"));

app.use(ErrorHandler);

app.listen(port, () => {
  console.log(`server started on port ${port}`);
});
