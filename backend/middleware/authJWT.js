const jwt = require("jsonwebtoken");
User = require("../models/user");
require("dotenv").config;

const verifyToken = (req, res, next) => {
  if (req.headers.authorization) {
    //check for a auth header
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
      console.log(err);
      res.status(500).send({
        message: "Verification failed, invalid JWT",
      });
    }
  } else {
    req.user = undefined;
    res.status(500).send({
      message: "No auth headers present", //send back error instead of cont
    });
  }
};
module.exports = verifyToken;
