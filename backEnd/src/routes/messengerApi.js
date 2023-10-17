const express = require("express");
const {
  messengerSend,
  recipientList,
  listMess,
  lastedMess,
  viewMess,
} = require("../controllers/messenger");
const Router = express.Router();

// api messenger;
Router.post("/create", messengerSend);
Router.post("/viewMes", viewMess);
Router.get("/recipient/:sender_id", recipientList);
Router.get("/listMes/:sender_id/:recipient_id", listMess);
Router.get("/lastedMess/:sender_id/:recipient_id", lastedMess);

module.exports = Router;
