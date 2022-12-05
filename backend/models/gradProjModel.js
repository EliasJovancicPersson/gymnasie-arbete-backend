const mongoose = require("mongoose");

const subjects = [
  "naturvetenskapsprogrammet",
  "teknikprogrammet",
  "ekonomiprogrammet",
  "humanistiskaprogrammet",
  "samhällsvetenskapligaprogrammet",
  "estetiskaprogrammet",
  "internationall-baccalaureate",
];

const gradProjModel = mongoose.Schema(
  {
    title: {
      type: String,
      requied: [true, "please add a title"],
    },
    author: {
      type: String,
      requied: [true, "please add a author"],
    },
    text: {
      type: String,
      requied: [true, "please add a text value"],
    },
    subject: {
      type: String,
      enum: subjects,
      requied: [true, "please add a text value"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("GradProject", gradProjModel);
