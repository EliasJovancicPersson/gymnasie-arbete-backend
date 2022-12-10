const asyncHandler = require("express-async-handler");

const Project = require("../models/gradProjModel");

// @desc    Get goals
// @route   GET /api/goals
// @access  Private
const getGradProjs = asyncHandler(async (req, res) => {
  res.set({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
    "content-type": "application/json",
  });

  const projects = await Project.find();

  res.status(200).json({ projects });
});

// @desc    Set goal
// @route   POST /api/goals
// @access  Private
const setGradProj = asyncHandler(async (req, res) => {
  res.set({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
    "content-type": "application/x-www-form-urlencoded",
  });

  if (
    !req.body.title ||
    !req.body.author ||
    !req.body.text ||
    !req.body.subject
  ) {
    res.status(400);
    throw new Error("please add all text fields" + "    " + req.body);
  }

  const project = await Project.create({
    title: req.body.title,
    author: req.body.author,
    text: req.body.text, //create project doc with text
    subject: req.body.subject,
  });

  res.status(200).json({ project } + req.body.title);
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

// @desc    Delete project
const deleteGradProj = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(400);
    throw new Error("goal not found");
  }

  await project.remove();

  res.status(200).json({ id: req.params.id });
});

// @desc    Get seperate proj
const getGradProj = asyncHandler(async (req, res) => {
  res.set({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
    "content-type": "application/json",
  });

  const project = await Project.findById(req.params.id);

  res.status(200).json({ project });
});

module.exports = {
  getGradProjs,
  setGradProj,
  updateGradProj,
  deleteGradProj,
  getGradProj,
};
