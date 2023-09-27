const connection = require("../config/database");
const bcrypt = require("bcrypt");
const saltRounds = 10;

// api account
const register = (req, res) => {
  const { username, password, email } = req.body;
  const myPlaintextPassword = password;
  if (!username || !password || !email) {
    return res.status(400).json({ error: "Vui lòng nhập đủ thông tin" });
  }
  bcrypt.hash(myPlaintextPassword, saltRounds, function (err, hash) {
    if (!err) {
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
          if (username.trim() === "admin") {
            connection.query(
              "INSERT INTO Users (username, password, email,role) VALUES (?, ?, ?,?)",
              [username, hash, email, "admin"],
              function (err, results, fields) {
                if (err) {
                  return res.status(500).json({ error: "Lỗi máy chủ amdin" });
                }
                res.status(200).json({ success: "Đăng ký thành công" });
              }
            );
          } else {
            connection.query(
              "INSERT INTO Users (username, password, email) VALUES (?, ?, ?)",
              [username, hash, email],
              function (err, results, fields) {
                if (err) {
                  return res.status(500).json({ error: "Lỗi máy chủ" });
                }
                res.status(200).json({ success: "Đăng ký thành công" });
              }
            );
          }
        }
      );
    }
  });
};

const login = (req, res) => {
  const { username, password } = req.body;
  connection.query(
    "SELECT * FROM Users WHERE username = ?",
    [username],
    async function (err, results, fields) {
      if (err) {
        return res.status(500).json({ error: "Lỗi máy chủ" });
      }
      if (results.length > 0) {
        const match = await bcrypt.compare(password, results[0].password);
        if (match) {
          return res.status(200).json({ error: "Đăng nhập thành công" });
        } else {
          return res.status(400).json({ error: "Sai tài khoản hoặc mật khẩu" });
        }
      } else {
        return res.status(400).json({ error: "Sai tài khoản hoặc mật khẩu" });
      }
    }
  );
};

module.exports = {
  login,
  register,
};
