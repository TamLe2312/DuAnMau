const express = require("express");
const {
  sendNotifcation,
  listNotifcation,
  unNotifcation,
  viewNotifcation,
  notifcation,
} = require("../controllers/notification");
const Router = express.Router();

// api login;
Router.post("/sendNotification", sendNotifcation);
Router.post("/unNotifcation", unNotifcation);
Router.post("/viewNotifcation", viewNotifcation);
Router.get("/listNotification/:myID", listNotifcation);
Router.get("/notifcation/:myID", notifcation);

module.exports = Router;
