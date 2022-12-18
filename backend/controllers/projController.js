const { response } = require("express");
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");

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

// @desc    Set grad project without image
// @route   POST /wiki
const setGradProj = asyncHandler(async (req, res) => {
  res.set({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
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

  //if no file

  const id = uuidv4();

  const project = await Project.create({
    title: req.body.title,
    author: req.body.author,
    text: req.body.text, //create project doc with text
    subject: req.body.subject,
    _id: id,
  });

  console.log(req.files);
  const url = `https://gyarbstorage.blob.core.windows.net/images/${req.files[0].originalname}/?sv=2021-06-08&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2023-01-01T08:36:38Z&st=2022-12-18T00:36:38Z&sip=81.227.69.179&spr=https,http&sig=aTYVYZFiNOzHmHLQ0GGDLKbAGnOQeta7HrWd7jb7jL8%3D`; //TODO : hide url in env
  //fetch with url and SAS token
  fetch(url, {
    method: "PUT",
    headers: { "x-ms-blob-type": "BlockBlob" },
    body: req.files[0].buffer, //send the buffer to be able to view it as a PNG or JPG
  }).then((response) => console.log(response));

  res.status(200).json(id + " | " + url);
});

// @desc    Update goals
// @route   PUT /api/goals/:id
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
