const express = require("express");
const {
  login,
  register,
  forgotPassword,
  verifyToken,
  detail,
} = require("../controllers/account");
const Router = express.Router();

// api login;

Router.post("/register", register);
Router.post("/login", login);
Router.post("/forgotPassword", forgotPassword);
Router.post("/verifyToken", verifyToken);
Router.post("/detail/:id", detail);

module.exports = Router;
