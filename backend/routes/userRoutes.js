var express = require("express"),
  router = express.Router(),
  verifyToken = require("../middleware/authJWT"),
  {
    signup,
    signin,
    signout,
    getUser,
  } = require("../controllers/authController.js");

router.post("/register", signup, function (req, res) {});

router.post("/login", signin, function (req, res) {});

router.post("/logout", verifyToken, signout, function (req, res) {});

router.get("/:profileId", verifyToken, getUser, function (req, res) {});

module.exports = router;
