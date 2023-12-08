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
  dataPostAndUser,
  // list comment post
  listCommenOnetPost,
  banComment,
  flagPost,
  listFlagPost,
  banPost,

  storiesImg,
  storiesContent,
  getDataNews,
  getDataNewsUser,
  storiesDelete,
} = require("../controllers/post");
const Router = express.Router();
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../frontEnd/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });
// api login;
Router.post("/create", createPost);
Router.post("/storiesImg", upload.single("newsImg"), storiesImg);
Router.post("/storiesContent", storiesContent);
Router.post("/createGroupPost", createGroupPost);
Router.post("/upimgs", upImgs);
Router.post("/groupUpImgs", groupUpImgs);
Router.get("/dataPostAndUser/:idPost", dataPostAndUser);
Router.get("/datapost/:page", dataPost);
Router.get("/postimg/:postID", postimgs);
Router.get("/postGroupImgs/:postGroupId", postGroupImgs);
Router.post("/deldete", deletePost);
Router.post("/storiesDelete", storiesDelete);
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
Router.get("/listCommentPost/:postID&:groupPostId", listCommentPost);
Router.get("/oneCommentPost/:commentID", oneCommentPost);
Router.get("/countCommentPost/:postID&:groupPostId", countCommentPost);

// listCommenOnetPost;
Router.get("/lisComents/:postID/:page", listCommenOnetPost);
Router.post("/banComment", banComment);
Router.get("/getDataNews", getDataNews);

Router.post("/banPost", banPost);

// flag
Router.post("/flagPost", flagPost);
Router.get("/listFlagPost/:postID", listFlagPost);

Router.get("/getDataNewsUser/:idNews", getDataNewsUser);

module.exports = Router;
