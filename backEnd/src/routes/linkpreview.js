const express = require("express");

const { getLinkPreview } = require("../controllers/linkPreviewController");

const Router = express.Router();

Router.post("/getLinkPreview", getLinkPreview);

module.exports = Router;
