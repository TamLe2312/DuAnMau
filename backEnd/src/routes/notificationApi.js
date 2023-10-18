const express = require("express");
const {
  sendNotifcation,
  listNotifcation,
  unNotifcation,
} = require("../controllers/notification");
const Router = express.Router();

// api login;
Router.post("/sendNotification", sendNotifcation);
Router.post("/unNotifcation", unNotifcation);
Router.get("/listNotification/:myID", listNotifcation);

module.exports = Router;
