const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const { findByIdAndUpdate, findOne } = require("../models/gradProjModel");
const { BlobServiceClient } = require("@azure/storage-blob");

const blobServiceClient = BlobServiceClient.fromConnectionString(
	"DefaultEndpointsProtocol=https;AccountName=expresspdf;AccountKey=cJ3lP0tgaQGjNj0dF6tjWD6qAeLkxG7nTfpd2pkiRyKN8xXJbgVvT7lGl2wmdlkRPpeWseHWFagq+AStPYHdhA==;EndpointSuffix=core.windows.net"
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

// @desc    Set grad project without image
// @route   POST /wiki
const setGradProj = asyncHandler(async (req, res) => {
	if (!req.body) {
		res.status(400);
		throw new Error("please add all text fields" + "    " + req.body["title"]);
	}

	const id = uuidv4();

	if (req.files) {
		//upload pdf
		const { buffer, originalname } = req.files["pdf"][0]; //TODO : add support for multiple files, should be just doing a foreach

		const blockBlobClient = containerClient.getBlockBlobClient(originalname);
		const response = await blockBlobClient.uploadData(buffer, {
			blobHTTPHeaders: {
				blobContentType: "application/pdf",
			},
		});
	}
	/*
	const project = await Project.create({
		title: req.body.title,
		author: req.body.author,
		text: req.body.text, //create project doc with text
		subject: req.body.subject,
		_id: id,
	});
  */
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
