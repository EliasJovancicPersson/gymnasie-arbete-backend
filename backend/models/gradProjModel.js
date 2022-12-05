const mongoose = require("mongoose");

const gradProjModel = mongoose.Schema(
	{
		text: {
			type: String,
			requied: [true, "please add a text value"],
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("GradProject", gradProjModel);
