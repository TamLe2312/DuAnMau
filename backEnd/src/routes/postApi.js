const express = require("express");
const { createPost, upImgs } = require("../controllers/post");
const Router = express.Router();

// api login;
Router.post("/create", createPost);
Router.post("/upimgs", upImgs);

module.exports = Router;
