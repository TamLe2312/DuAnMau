const express = require("express");
const {
    createGroup,
    getDataGroup,
    searchGroup,
    getDataGroupProfile,
    changeAvatarGroup,
    removeAvatarGroup,
    UpdateInformationProfileGroup,
    removeGroup,
    getDataGroupJoined,
    joinGroup,
    TotalMembers,
    outGroup,
} = require("../controllers/groups");
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
Router.post("/removeGroup", removeGroup);
Router.post("/updateInformationProfileGroup", UpdateInformationProfileGroup);
Router.post("/searchGroup", searchGroup);
Router.post("/createGroup", upload.single("avatarGroup"), createGroup);
Router.post("/removeAvatarGroup", removeAvatarGroup);
Router.post("/joinGroup", joinGroup);
Router.post("/outGroup", outGroup);
Router.post("/changeAvatarGroup", upload.single("avatarGroup"), changeAvatarGroup);
Router.get("/getDataGroup", getDataGroup);
Router.get("/group/:groupId", getDataGroupProfile);
Router.get("/TotalMembers/:groupId", TotalMembers);
Router.get("/getDataGroupJoined", getDataGroupJoined)

module.exports = Router;