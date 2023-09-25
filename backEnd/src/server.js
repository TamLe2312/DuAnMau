// require("dotenv").config();
const express = require("express");
var bodyParser = require("body-parser");
const path = require("path");
const configViewEngine = require("./config/viewEngine");
const webRoutes = require("./routes/web");
const api = require("./routes/api");
const connection = require("./config/database");
const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

const port = process.env.PORT || 8888;
const hostname = process.env.HOST_NAME;

configViewEngine(app);

app.use("/", webRoutes);

// api account
app.use("/account", api);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
