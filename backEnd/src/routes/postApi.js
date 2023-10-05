const express = require("express");
const {
  createPost,
  upImgs,
  dataPost,
  postimgs,
} = require("../controllers/post");
const Router = express.Router();

// api login;
Router.post("/create", createPost);
Router.post("/upimgs", upImgs);
Router.get("/datapost/:page", dataPost);
Router.get("/postimg/:postID", postimgs);

module.exports = Router;
