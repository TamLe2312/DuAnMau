const express = require("express");
const { login, register } = require("../controllers/account");
const Router = express.Router();

// api login;
Router.post("/register", register);
Router.post("/login", login);

module.exports = Router;
