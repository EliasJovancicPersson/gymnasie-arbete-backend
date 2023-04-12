const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const { findByIdAndUpdate, findOne } = require("../models/gradProjModel");
const { BlobServiceClient } = require("@azure/storage-blob");

const blobServiceClient = BlobServiceClient.fromConnectionString(
  process.env.AZURE_URI
);
const containerClient = blobServiceClient.getContainerClient("pdf");

const Project = require("../models/gradProjModel");

// @desc    Get projects with query
// @route   GET /wiki/search
// @access  Private
const getGradProjsQuery = asyncHandler(async (req, res) => {
  const filter = Object.keys(req.query);

  const regex = new RegExp(req.query[filter[0]], "i");

  const projects = await Project.find({ [filter[0]]: regex });

  res.status(200).json({ projects });
});

// @desc    Get all projects
// @route   GET /wiki
const getGradProjs = asyncHandler(async (req, res) => {
  const projects = await Project.find();

  res.status(200).json({ projects });
});

// @desc    Set grad project
// @route   POST /wiki
const setGradProj = asyncHandler(async (req, res) => {
  if (!req.body || !req.files) {
    res.status(400);
    throw new Error("please add all text and file fields");
  }
  console.log(req.body)
  if (req.files) {
    //upload pdf
    let { buffer } = req.files["pdf"][0]; //TODO : add support for multiple files, should be just doing a foreach

    const fileName = Date.now() + "-" + uuidv4();
    console.log(fileName);

    const blockBlobClient = containerClient.getBlockBlobClient(fileName);
    const response = await blockBlobClient.uploadData(buffer, {
      blobHTTPHeaders: {
        blobContentType: "application/pdf",
      },
    });
    var pdfUrl = process.env.AZURE_URL + fileName;
    //create url for pdf
  }
  const id = uuidv4();

  const project = await Project.create({
    title: req.body.title,
    author: req.body.author,
    pdf: pdfUrl, //create project doc with text
    subject: req.body.subject,
    _id: id,
  });
  res.status(200).json({ id: id });
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
