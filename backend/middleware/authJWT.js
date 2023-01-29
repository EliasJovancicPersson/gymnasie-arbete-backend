const jwt = require("jsonwebtoken");
User = require("../models/user");
require("dotenv").config;

const verifyToken = (req, res, next) => {
  if (req.cookies.jwt) {
    //check for a auth header
    try {
      jwt.verify(
        req.cookies.jwt,
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
      console.log(err);
      res.status(500).send({
        message: "Verification failed, invalid JWT",
      });
    }
  } else {
    req.user = undefined; //not needed?
    res.status(401).send({
      message: "No jwt cookie present", //send back error instead of cont
    });
  }
};
module.exports = verifyToken;
