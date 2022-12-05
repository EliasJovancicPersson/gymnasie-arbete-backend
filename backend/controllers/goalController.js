const asyncHandler = require("express-async-handler");

const Project = require("../models/gradProjModel");

// @desc    Get goals
// @route   GET /api/goals
// @access  Private
const getGradProjs = asyncHandler(async (req, res) => {
	const project = await Goal.find();

	res.status(200).json({ project });
});

// @desc    Set goal
// @route   POST /api/goals
// @access  Private
const setGradProj = asyncHandler(async (req, res) => {
	if (!req.body.text) {
		res.status(400);
		throw new Error("please add a text field");
	}

	const project = await Project.create({
		text: req.body.text, //create project doc with text
	});

	res.status(200).json({ project });
});

// @desc    Update goals
// @route   PUT /api/goals/:id
// @access  Private
const updateGradProj = asyncHandler(async (req, res) => {
	const project = await Project.findById(req.params.id);

	if (!project) {
		res.status(400);
		throw new Error("goal not found");
	}

	const updatedProject = await Project.findByIdAndUpdate(
		req.params.id,
		req.body,
		{
			new: true,
		}
	);

	res.status(200).json({ updatedProject });
});

// @desc    Delete goals
// @route   DELETE /api/goals/:id
// @access  Private
const deleteGradProj = asyncHandler(async (req, res) => {
	const project = await Project.findById(req.params.id);

	if (!project) {
		res.status(400);
		throw new Error("goal not found");
	}

	await project.remove();

	res.status(200).json({ id: req.params.id });
});

module.exports = { getGradProjs, setGradProj, updateGradProj, deleteGradProj };
