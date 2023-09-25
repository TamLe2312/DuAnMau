const express = require("express");
const { getHomepage } = require("../controllers/homeController");
const { getTest } = require("../controllers/homeController");
const Router = express.Router();

Router.get("/", getHomepage);
Router.get("/test", getTest);

module.exports = Router;
