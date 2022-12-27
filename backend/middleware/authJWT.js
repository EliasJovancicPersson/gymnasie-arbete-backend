const jwt = require("jsonwebtoken");
User = require("../models/user");
require("dotenv").config;

const verifyToken = (req, res, next) => {
  if (req.headers && req.headers.authorization) {
    try {
      jwt.verify(
        req.headers.authorization,
        process.env.API_SECRET,
        function (err, decode) {
          if (err) req.user = undefined;

          User.findOne({
            _id: decode.id,
          }).exec((err, user) => {
            if (err) {
              res.status(500).send({
                message: err,
              });
            } else {
              req.user = user;
              next();
            }
          });
        }
      );
    } catch (err) {
      res.status(500).send({
        message: err + " Verification failed, wrong JWT",
      });
    }
  } else {
    req.user = undefined;
    res.status(500).send({
      message: "Verification failed",
    });
  }
};
module.exports = verifyToken;
