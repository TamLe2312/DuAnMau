const express = require("express");
const {
  login,
  register,
  forgotPassword,
  verifyToken,
  detail,
  listUsers,
} = require("../controllers/account");
const Router = express.Router();

// api login;

Router.post("/register", register);
Router.post("/login", login);
Router.post("/forgotPassword", forgotPassword);
Router.post("/verifyToken", verifyToken);
Router.get("/detail/:id", detail);
Router.get("/listUsers/:slug", listUsers);
module.exports = Router;
