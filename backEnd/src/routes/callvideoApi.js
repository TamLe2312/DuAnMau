const express = require("express");
const { callEnd, missedCall } = require("../controllers/callvideo");
const Router = express.Router();

// api messenger;
Router.post("/callEnd", callEnd);
Router.post("/missedCall", missedCall);
module.exports = Router;
