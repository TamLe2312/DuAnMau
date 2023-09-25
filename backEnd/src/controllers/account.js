const connection = require("../config/database");

// api account
const register = (req, res) => {
  const { username, password, email } = req.body;
  // res.send(JSON.stringify(req.body));
  if (!username || !password || !email) {
    return res.status(400).json({ error: "Vui lòng nhập đủ thông tin" });
  }
  connection.query(
    "SELECT * FROM Users WHERE username = ? OR email = ?",
    [username, email],
    function (err, results, fields) {
      if (err) {
        return res.status(500).json({ error: "Lỗi máy chủ" });
      }
      if (results.length > 0) {
        return res
          .status(400)
          .json({ error: "Tên người dùng hoặc email đã tồn tại" });
      }
      connection.query(
        "INSERT INTO Users (username, password, email) VALUES (?, ?, ?)",
        [username, password, email],
        function (err, results, fields) {
          if (err) {
            return res.status(500).json({ error: "Lỗi máy chủ" });
          }
          res.status(200).json({ success: "Đăng ký thành công" });
        }
      );
    }
  );
};

const login = (req, res) => {
  let users = [];
  connection.query("SELECT * FROM Users", function (err, results, fields) {
    users = results;
    res.send(JSON.stringify(users));
  });
};

module.exports = {
  login,
  register,
};
