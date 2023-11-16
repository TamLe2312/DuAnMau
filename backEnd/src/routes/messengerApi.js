const express = require("express");
const {
  messengerSend,
  recipientList,
  listMess,
  lastedMess,
  viewMess,
  delMess,
  upImgsMes,
  listMessImg,
  upRecordMes,
  // delRecord,
  // deletePostImgsMess,
  // test,
} = require("../controllers/messenger");
const Router = express.Router();

// api messenger;
Router.post("/create", messengerSend);
Router.post("/upImgMess", upImgsMes);
Router.post("/viewMes", viewMess);
Router.post("/delMes", delMess);
Router.post("/upRecord", upRecordMes);
// Router.post("/delRecord", delRecord);
// Router.post("/delImgMes", deletePostImgsMess);
Router.get("/recipient/:sender_id", recipientList);
Router.get("/listImgMess/:mesID", listMessImg);
Router.get("/listMes/:sender_id/:recipient_id", listMess);
// Router.get("/test/:sender_id/:recipient_id", test);
Router.get("/lastedMess/:sender_id/:recipient_id", lastedMess);

module.exports = Router;
