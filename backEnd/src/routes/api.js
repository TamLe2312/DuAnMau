const express = require("express");
const {
  login,
  register,
  forgotPassword,
  verifyToken,
} = require("../controllers/account");
const Router = express.Router();

// api login;


Router.post("/register", register);
Router.post("/login", login);
Router.post("/forgotPassword", forgotPassword);
Router.post("/verifyToken", verifyToken);

module.exports = Router;
