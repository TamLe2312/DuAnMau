const connection = require("../config/database");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const someOtherPlaintextPassword = "not_bacon";
const mailer = require('../utils/mailer')
// api account
const register = (req, res) => {
  const { username, password, email, name } = req.body;
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
            return res.status(500).json({ error: "Lỗi máy chủ 1" });
          }
          if (results.length > 0) {
            return res
              .status(400)
              .json({ error: "Tên người dùng hoặc email đã tồn tại" });
          }
          connection.query(
            "INSERT INTO Users (username, password, email) VALUES (?, ?, ?)",
            [username, hash, email],
            function (err, results, fields) {
              if (err) {
                console.error(err);
                return res.status(500).json({ error: "Lỗi máy chủ 2" });
              }
              res.status(200).json({ success: "Đăng ký thành công" });
            }
          );
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

const forgotPassword = (req, res) => {
  const { username, email } = req.body;
  if (!username || !email) {
    return res.status(400).json({ error: "Vui lòng nhập đủ thông tin" });
  }
  connection.query(
    "SELECT * FROM Users WHERE username = ? AND email = ?",
    [username, email],
    async function (err, results, fields) {
      if (err) {
        return res.status(500).json({ error: "Lỗi máy chủ" });
      }
      if (results.length > 0) {
        bcrypt.hash(email, saltRounds, function (err, hash) {
          let htmlContent = `<a href="${process.env.APP_URL}/verifyToken?email=${email}&token=${hash}">Forgot Password</a>`
          if (!err) {
            mailer.sendMail(email, "Test", htmlContent)
          }
        });
        return res.status(200).json({ success: "Gửi thành công" });
      } else {
        return res.status(400).json({ error: "Sai tài khoản hoặc email" });
      }
    }
  );
};

const verifyToken = (req, res) => {
  const { username, password, Cpassword } = req.body;
  if (!username || !password || !Cpassword) {
    return res.status(400).json({ error: "Vui lòng nhập đủ thông tin" });
  }
  if (password !== Cpassword) {
    return res.status(400).json({ error: "Mật khẩu không khớp" });
  }
  connection.query(
    "SELECT * FROM Users WHERE username = ?",
    [username],
    async function (err, results, fields) {
      if (err) {
        return res.status(500).json({ error: "Lỗi máy chủ" });
      }
      if (results.length > 0) {
        const match = await bcrypt.compare(email, results[0].email);
      } else {
        return res.status(400).json({ error: "Sai username.Vui lòng nhập lại" });
      }
    }
  );

}

module.exports = {
  login,
  register,
  forgotPassword,
  verifyToken,
};