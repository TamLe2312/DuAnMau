const express = require("express");
const {
  createPost,
  upImgs,
  dataPost,
  postimgs,
  deletePost,
  deletePostImgs,
} = require("../controllers/post");
const Router = express.Router();

// api login;
Router.post("/create", createPost);
Router.post("/upimgs", upImgs);
Router.get("/datapost/:page", dataPost);
Router.get("/postimg/:postID", postimgs);
Router.post("/deldete", deletePost);
Router.post("/deletePostImgs", deletePostImgs);
module.exports = Router;
