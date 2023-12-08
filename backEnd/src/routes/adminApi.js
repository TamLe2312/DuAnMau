const express = require("express");
const connection = require("../config/database");
const {
  getDataAllUser,
  deleteUser,
  deleteGroup,
  AdjustInformUser,
  createNewUser,
  getDataAllGroup,
  getDataCreatedGroupUser,
  adjustGroupInformContent,
  adjustGroupInform,
  getDataAllPost,
  postImgs,
  deletePost,
  deletePostImgs,
  getDataAllAds,
  deleteAds,
  createNewAds,
} = require("../controllers/adminController");
const Router = express.Router();

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../frontEnd/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });
// api login;

Router.post("/deleteUser", deleteUser);
Router.post("/deleteGroup", deleteGroup);
Router.post("/deletePost", deletePost);
Router.post("/deleteAds", deleteAds);
Router.post("/deletePostImgs", deletePostImgs);
Router.post("/adjustInformUser", AdjustInformUser);
Router.post("/adjustGroupInformContent", adjustGroupInformContent);
Router.post("/createNewUser", createNewUser);
Router.post("/createNewAds", upload.array("images"), createNewAds);

Router.get("/getDataAllUser/:page", getDataAllUser);
Router.get("/getDataAllGroup/:page", getDataAllGroup);
Router.get("/getDataAllPost/:page", getDataAllPost);
Router.get("/getDataAllAds/:page", getDataAllAds);
Router.get("/getDataCreatedGroupUser/:id", getDataCreatedGroupUser);
Router.get("/postImgs/:id", postImgs);
Router.post("/adjustGroupInform", upload.single("avatar"), adjustGroupInform);

module.exports = Router;
