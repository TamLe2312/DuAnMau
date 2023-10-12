const express = require("express");
const {
  createPost,
  createGroupPost,
  upImgs,
  groupUpImgs,
  dataPost,
  postimgs,
  postGroupImgs,
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
  countCommentPost,
  oneCommentPost,
} = require("../controllers/post");
const Router = express.Router();

// api login;
Router.post("/create", createPost);
Router.post("/createGroupPost", createGroupPost);
Router.post("/upimgs", upImgs);
Router.post("/groupUpImgs", groupUpImgs);
Router.get("/datapost/:page", dataPost);
Router.get("/postimg/:postID", postimgs);
Router.get("/postGroupImgs/:postGroupId", postGroupImgs);
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
Router.get("/oneCommentPost/:commentID", oneCommentPost);
Router.get("/countCommentPost/:postID", countCommentPost);
module.exports = Router;
