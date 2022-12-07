const express = require("express");
const colors = require("colors");
const dotenv = require("dotenv").config();
const { errorHandler } = require("./middleware/errorMiddleware");
const connectDB = require("./config/db");
const port = process.env.PORT || 5000;

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.all("/", function (req, res, next) {
  res.set({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "content-type",
    "content-type": "application/json",
  });
  next();
});

app.use("/wiki", require("./routes/projRoutes"));

app.use(errorHandler);

app.listen(port, () => {
  console.log(`server started on port ${port}`);
});
