const express = require("express");
const {
  messengerSend,
  recipientList,
  listMess,
} = require("../controllers/messenger");
const Router = express.Router();

// api messenger;
Router.post("/create", messengerSend);
Router.get("/recipient/:sender_id", recipientList);
Router.get("/listMes/:sender_id/:recipient_id", listMess);

module.exports = Router;
