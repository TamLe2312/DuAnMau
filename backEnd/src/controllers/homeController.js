const connection = require("../config/database");
// const { use } = require("../routes/web");

const getHomepage = (req, res) => {
    res.send("hello world from FplHub");
};
const getTest = (req, res) => {
    res.render("sample.ejs");
};

module.exports = {
    getHomepage,
    getTest,
};