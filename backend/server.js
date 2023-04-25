const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const colors = require("colors");
const dotenv = require("dotenv").config();
const { ErrorHandler } = require("./middleware/errorMiddleware");
const { CheckFiles } = require("./middleware/checkFileMiddleware");
const connectDB = require("./config/db");
const port = process.env.PORT || 5000;
const multer = require("multer");
const upload = multer();
const bodyParser = require("body-parser");
const verifyToken = require("./middleware/authJWT"); //use this to ensure all users are logged in before sending a response/ if no token is present it will return status:500

let corsOptions = {
	origin: "https://127.0.0.1:5500",
	credentials: true,
};

connectDB();

const app = express();

app.use(cors(corsOptions));

app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/auth/", require("./routes/userRoutes"));

app.post(
	"/wiki" /*, verifyToken*/,
	upload.fields([
		{ name: "pdf", maxCount: 1 }, // specify that we expect a file named "pdf"
		{ name: "author", maxCount: 1 }, // specify that we expect a text field named "author"
		{ name: "title", maxCount: 1 }, // specify that we expect a text field named "title"
		{ name: "subject", maxCount: 1 }, // specify that we expect a text field named "subject"
	]),
	CheckFiles
);

app.use("/wiki" /*, verifyToken*/, require("./routes/projRoutes"));

app.use(ErrorHandler);

app.use((req, res, next) => {
	res.status(404).send("Sorry can't find that!");
});

app.listen(port, () => {
	console.log(`server started on port ${port}`);
});
