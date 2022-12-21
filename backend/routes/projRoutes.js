const express = require("express");
const router = express.Router();
const {
  getGradProjs,
  setGradProj,
  updateGradProj,
  deleteGradProj,
  getGradProj,
} = require("../controllers/projController");

router.route("/").get(getGradProjs).post(setGradProj);

//router.route("/:id").delete(deleteGradProj).put(updateGradProj);

router.route("/:id").get(getGradProj);

module.exports = router;
