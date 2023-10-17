const express = require("express");
const connection = require("../config/database");
const {
  login,
  register,
  forgotPassword,
  verifyToken,
  ChangePassword,
  UpdateInformationProfile,
  getDataUser,
  changeAvatar,
  detail,
  listUsers,
  RemoveAvatar,
  postProfileUser,
  CountPost,
  FollowUser,
  FollowerData,
  suggestFollow,
  UnfollowUser,
} = require("../controllers/account");
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
Router.get("/getDataUser/:id", getDataUser);

Router.post("/UpdateInformationProfile", UpdateInformationProfile);
Router.post("/removeAvatar", RemoveAvatar);
Router.post("/changeAvatar", upload.single("avatar"), changeAvatar);
Router.post("/register", register);
Router.get("/postProfileUser/:id&:page", postProfileUser);
Router.post("/login", upload.single("avatar"), login);
Router.post("/forgotPassword", forgotPassword);
Router.post("/followUser", FollowUser);
Router.post("/unfollowUser", UnfollowUser);
Router.post("/verifyToken", verifyToken);
Router.post("/ChangePassword", ChangePassword);
Router.get("/detail/:id", detail);
Router.get("/listUsers/:slug", listUsers);
Router.get("/countPost/:userId", CountPost);
Router.get("/followerData/:id&:page", FollowerData);
Router.get("/suggestFollow/:id&:limit", suggestFollow);
module.exports = Router;
