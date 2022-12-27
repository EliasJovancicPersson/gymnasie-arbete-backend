var express = require("express"),
  router = express.Router(),
  verifyToken = require("../middleware/authJWT"),
  { signup, signin } = require("../controllers/authController.js");

router.post("/register", signup, function (req, res) {});

router.post("/login", signin, function (req, res) {});

router.get("/hiddencontent", verifyToken, function (req, res) {
  if (!req.user) {
    res.status(403).send({
      message: "Invalid JWT token",
    });
  }
  if (req.user) {
    res.status(200).send({
      message: "Congratulations! but there is no hidden content",
    });
  } else {
    res.status(403).send({
      message: "Unauthorised access",
    });
  }
});

module.exports = router;
