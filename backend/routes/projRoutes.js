const express = require("express");
const router = express.Router();
const {
	getGradProjs,
	setGradProj,
	updateGradProj,
	deleteGradProj,
} = require("../controllers/projController");

router.route("/").get(getGradProjs).post(setGradProj);

router.route("/:id").delete(deleteGradProj).put(updateGradProj);

module.exports = router;
