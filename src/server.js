require('dotenv').config();
const express = require('express');
const path = require('path');
const configViewEngine = require('./config/viewEngine');
const webRoutes = require('./routes/web');
const connection = require('./config/database');



const app = express()
const port = process.env.PORT || 8888;
const hostname = process.env.HOST_NAME;


configViewEngine(app);

app.use('/', webRoutes);


connection.query(
    'SELECT * FROM Users',
    function (err, results, fields) {
        console.log(results); // results contains rows returned by server
    }
);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})