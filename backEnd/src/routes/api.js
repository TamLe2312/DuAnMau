const express = require("express");
const {
  login,
  register,
  forgotPassword,
  verifyToken,
  ChangeAvatar,
  UpdateInformationProfile,
  getDataUser,
} = require("../controllers/account");
const Router = express.Router();

// api login;
Router.get("/getDataUser/:id", getDataUser);

Router.post("/UpdateInformationProfile", UpdateInformationProfile);
Router.post("/changeAvatar", ChangeAvatar);
Router.post("/register", register);
Router.post("/login", login);
Router.post("/forgotPassword", forgotPassword);
Router.post("/verifyToken", verifyToken);

module.exports = Router;
