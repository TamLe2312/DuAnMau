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
    postImgs
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
Router.post("/adjustInformUser", AdjustInformUser);
Router.post("/adjustGroupInformContent", adjustGroupInformContent);
Router.post("/createNewUser", createNewUser);
Router.get("/getDataAllUser", getDataAllUser);
Router.get("/getDataAllGroup", getDataAllGroup);
Router.get("/getDataAllPost", getDataAllPost);
Router.get("/getDataCreatedGroupUser/:id", getDataCreatedGroupUser);
Router.get("/postImgs/:id", postImgs);
Router.post("/adjustGroupInform", upload.single("avatar"), adjustGroupInform);


module.exports = Router;
