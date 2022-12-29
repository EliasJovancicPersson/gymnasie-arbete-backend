const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");
exports.signup = (req, res) => {
  const user = new User({
    fullName: req.body.fullName,
    email: req.body.email,
    role: req.body.role,
    password: bcrypt.hashSync(req.body.password, 8),
  });

  user.save((err, user) => {
    if (err) {
      res.status(500).send({
        message: err,
      });
      return;
    } else {
      res.status(200).send({
        message: "User Registered successfully",
      });
    }
  });
};

exports.signin = (req, res) => {
  console.log(req.body.email);

  console.log(req.body.password);
  User.findOne({
    email: req.body.email,
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({
        message: err,
      });
      return;
    }
    if (!user) {
      return res.status(404).send({
        message: "User Not found.",
      });
    }

    //comparing passwords
    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    // checking if password was valid and send response accordingly
    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Password!",
      });
    }
    //signing token with user id
    var token = jwt.sign(
      {
        id: user.id,
      },
      process.env.API_SECRET,
      {
        expiresIn: "10 days",
      }
    );

    //responding to client request with user profile success message and  access token .¨
    res.cookie("jwt", token, {
      httpOnly: false,
      expires: new Date(Date.now() + 9999999),
      sameSite: "none",
      secure: "true",
    }); //send token as a cookie when logging in
    res.status(200).send({
      message: "Login successfull",
    });
  });
};
