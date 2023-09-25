const connection = require('../config/database');
const { use } = require('../routes/web');

const getHomepage = (req, res) => {

    let users = [];

    connection.query(
        'SELECT * FROM Users',
        function (err, results, fields) {
            users = results
            console.log('result homepage = ', results);

            console.log("User Information : ", users);
            res.send(JSON.stringify(users));
        }
    );

}
const getTest = (req, res) => {
    res.render('sample.ejs')
}
module.exports = {
    getHomepage, getTest
}