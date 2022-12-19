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
      required: [true, "please add a title"],
    },
    author: {
      type: String,
      required: [true, "please add a author"],
    },
    text: {
      type: String,
      required: [true, "please add a text value"],
    },
    subject: {
      type: String,
      enum: subjects,
      required: [true, "please add a text value"],
    },
    _id: {
      type: String,
      required: [true, "Please add a ID"],
    },
    images: {
      type: Array,
      required: [false],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("GradProject", gradProjModel);
