const { response } = require("express");
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const { findByIdAndUpdate, findOne } = require("../models/gradProjModel");

const Project = require("../models/gradProjModel");

// @desc    Get projects with query
// @route   GET /wiki/search
// @access  Private
const getGradProjsQuery = asyncHandler(async (req, res) => {
  res.set({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
    "content-type": "application/json",
  });

  const filter = Object.keys(req.query);

  const regex = new RegExp(req.query[filter[0]], "i");

  console.log(filter[0]);

  const projects = await Project.find({ [filter[0]]: regex });

  res.status(200).json({ projects });
});

// @desc    Get all projects
// @route   GET /wiki
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
  const images = [];
  if (req.files.length > 0) {
    console.log("files found");
    console.log(req.files);
    req.files.forEach((file) => {
      const url = `https://gyarbstorage.blob.core.windows.net/images/${file.originalname.replaceAll(
        " ",
        "" //replace whitespace in name
      )}/`;
      const type = file.originalname.substring(
        file.originalname.lastIndexOf(".") + 1,
        file.originalname.length
      );
      images.push(url);
      //fetch with url and SAS token
      fetch(url + process.env.SAS_TOKEN, {
        method: "PUT",
        headers: {
          "x-ms-blob-type": "BlockBlob",
          "content-type": "image/" + type,
        },
        body: file.buffer, //send the buffer to be able to view it as a PNG or JPG
      }).then(async () => {
        updatedProj = await Project.findByIdAndUpdate(id, {
          $push: { images: url },
        });
      });
    });
  }
  res.status(200).json({ id: id, images: images });
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
  getGradProjsQuery,
};
