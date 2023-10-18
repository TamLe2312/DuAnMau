const express = require("express");
const {
  sendNotifcation,
  listNotifcation,
  unNotifcation,
  viewNotifcation,
  countNotifcation,
} = require("../controllers/notification");
const Router = express.Router();

// api login;
Router.post("/sendNotification", sendNotifcation);
Router.post("/unNotifcation", unNotifcation);
Router.post("/viewNotifcation", viewNotifcation);
Router.get("/listNotification/:myID", listNotifcation);
Router.get("/countNotifcation/:myID", countNotifcation);

module.exports = Router;
