const express = require("express");
const {
  createPost,
  upImgs,
  dataPost,
  postimgs,
  deletePost,
  deletePostImgs,
  editPost,
  likePost,
  unLikePost,
  likedPost,
  CountLikedPost,
  commentPost,
  onCommentPostLast,
  listCommentPost,
  deleteCommentPost,
  editCommentPost,
} = require("../controllers/post");
const Router = express.Router();

// api login;
Router.post("/create", createPost);
Router.post("/upimgs", upImgs);
Router.get("/datapost/:page", dataPost);
Router.get("/postimg/:postID", postimgs);
Router.post("/deldete", deletePost);
Router.post("/deletePostImgs", deletePostImgs);
Router.post("/editPost", editPost);
Router.post("/likePost", likePost);
Router.post("/unLikePost", unLikePost);
Router.get("/likedPost", likedPost);
Router.post("/countLikedPost", CountLikedPost);

Router.post("/commentPost", commentPost);
Router.post("/deleteCommentPost", deleteCommentPost);
Router.post("/editCommentPost", editCommentPost);
Router.post("/onCommentPostLast", onCommentPostLast);
Router.get("/listCommentPost/:postID", listCommentPost);
module.exports = Router;
