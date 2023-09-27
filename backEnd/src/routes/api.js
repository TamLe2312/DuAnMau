const express = require("express");
const { login, register, forgotPassword, verifyToken } = require("../controllers/account");
const Router = express.Router();

// api login;
Router.get("/verifyToken", verifyToken);

Router.post("/register", register);
Router.post("/login", login);
Router.post("/forgotPassword", forgotPassword);

module.exports = Router;
