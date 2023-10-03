const connection = require("../config/database");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const someOtherPlaintextPassword = "not_bacon";
const mailer = require('../utils/mailer')
const Mustache = require('mustache');
const fs = require('fs');
const moment = require('moment');


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
            return res.status(500).json({ error: "Lỗi máy chủ 1" });
          }
          if (results.length > 0) {
            return res
              .status(400)
              .json({ error: "Tên người dùng hoặc email đã tồn tại" });
          }
        }
      );
      connection.query(
        "INSERT INTO Users (username, password, email) VALUES (?, ?, ?)",
        [username, hash, email],
        function (err, results, fields) {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: "Lỗi máy chủ 2" });
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
          req.session.uID = results[0].id;
          return res
            .status(200)
            .json({ id: req.session.uID, error: "Đăng nhập thành công" });
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
          if (!err) {
            const filePath = "../backEnd/src/public/html/EmailTemplate.html";
            fs.readFile(filePath, "utf8", (err, content) => {
              if (err) {
                console.error(`Đã xảy ra lỗi khi đọc file: ${err}`);
                return;
              }
              let data = {
                name: username,
                action_url: `${process.env.APP_URL}/verifyToken?email=${email}&token=${hash}`,
              };
              let htmlContent = Mustache.render(content, data);
              mailer.sendMail(
                email,
                "Forgot Password Notification",
                htmlContent
              );
              connection.query(
                "UPDATE Users SET token = ? WHERE email = ?",
                [hash, email],
                function (err, results, fields) {
                  if (err) {
                    console.error(err);
                    return res.status(500).json({ error: "Lỗi máy chủ" });
                  } else {
                    return res.status(200).json({ success: "Gửi thành công" });
                  }
                }
              );
            });
          }
        });
      } else {
        return res.status(400).json({ error: "Sai tài khoản hoặc email" });
      }
    }
  );
};

const verifyToken = (req, res) => {
  const { username, password, Cpassword, email } = req.body;
  if (!username || !password || !Cpassword) {
    return res.status(400).json({ error: "Vui lòng nhập đủ thông tin" });
  }
  if (password !== Cpassword) {
    return res.status(400).json({ error: "Mật khẩu không khớp" });
  }
  connection.query(
    "SELECT * FROM Users WHERE username = ? AND email = ?",
    [username, email],
    async function (err, results, fields) {
      if (err) {
        return res.status(500).json({ error: "Lỗi máy chủ" });
      }
      if (results.length > 0) {
        const match = await bcrypt.compare(email, results[0].token);
        if (match) {
          let TokenNew = email + "tamle123123";
          bcrypt.hash(TokenNew, saltRounds, function (err, hash) {
            if (err) {
              return res.status(500).json({ error: "Lỗi máy chủ" });
            }
            connection.query(
              "UPDATE USERS SET token = ? WHERE username = ?",
              [hash, username],
              async function (err, results, fields) {
                if (err) {
                  return res.status(500).json({ error: "Lỗi máy chủ" });
                }
                const myPlaintextPassword = password;
                bcrypt.hash(
                  myPlaintextPassword,
                  saltRounds,
                  function (err, hash) {
                    if (err) {
                      return res.status(500).json({ error: "Lỗi máy chủ" });
                    }
                    connection.query(
                      "UPDATE USERS SET password = ? WHERE username = ?",
                      [hash, username],
                      async function (err, results, fields) {
                        if (err) {
                          return res.status(500).json({ error: "Lỗi máy chủ" });
                        }
                        return res
                          .status(200)
                          .json({ success: "Đổi mật khẩu thành công" });
                      }
                    );
                  }
                );
              }
            );
          });
        } else {
          return res.status(400).json({ error: "Có lỗi xảy ra. Vui lòng thử lại" });
        }
      } else {
        return res
          .status(400)
          .json({ error: "Sai username. Vui lòng nhập lại" });
      }
    }
  );
};

const changeAvatar = (req, res) => {
  const id = req.body.id;
  const fileName = req.file.filename; // Sửa thành fileName thay vì filename
  const filePath = "/uploads/" + fileName;
  const baseURL = "http://localhost:5173/";
  const imageURL = `${baseURL.slice(0, -1)}${filePath}`;
  connection.query(
    "UPDATE Users SET avatar = ? WHERE id = ?",
    [imageURL, id],
    function (err, results, fields) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Lỗi máy chủ" });
      }
      return res.status(200).json({
        success: "Cập nhật avatar thành công", avatar: imageURL,
        fileName: fileName,
        filePath: filePath,
        id: id
      });
    }
  );
};

const getDataUser = (req, res) => {
  // const { id } = req.body;
  const id = req.params.id;
  connection.query(
    "SELECT * FROM Users WHERE id = ?",
    [id],
    async function (err, results, fields) {
      if (err) {
        return res.status(500).json({ error: "Lỗi máy chủ" });
      }
      if (results.length > 0) {
        return res.status(200).json(results);
      } else {
        return res.status(400).json({ error: "Người dùng không tồn tại" });
      }
    }
  );
}

const UpdateInformationProfile = (req, res) => {
  const { name, moTa, date, id } = req.body;
  const formattedDate = moment(date).format('YYYY-MM-DD');
  if (!name || !moTa || !date) {
    return res.status(400).json({ error: "Vui lòng nhập đủ thông tin" });
  }
  connection.query(
    "UPDATE Users SET name = ?, birddate = ?, moTa = ? WHERE id = ?",
    [name, formattedDate, moTa, id],
    function (err, results, fields) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Lỗi máy chủ" });
      }
      return res.status(200).json({ name: name, moTa: moTa, success: "Cập nhật thông tin thành công" });
    }
  );
}

const detail = (req, res) => {
  // const { id } = req.body;
  const id = req.params.id;
  connection.query(
    "SELECT id,username,birddate,name,avatar FROM Users WHERE id = ?",
    [id],
    async function (err, results, fields) {
      if (err) {
        return res.status(500).json({ error: "Lỗi máy chủ" });
      }
      if (results.length > 0) {
        return res.status(200).json(results);
      } else {
        return res.status(400).json({ error: "Người dùng không tồn tại" });
      }
    }
  );
};

const listUsers = (req, res) => {
  if (req.params.slug == 0) {
    const limit = 5; // Số lượng người dùng hiển thị trên mỗi trang
    connection.query(
      "SELECT id,username,birddate,name,avatar FROM Users WHERE role <> 'admin' ORDER BY RAND() LIMIT ?",
      [limit],
      function (err, results, fields) {
        if (err) {
          return res.status(500).json({ error: "Lỗi máy chủ" });
        }
        if (results.length > 0) {
          return res.status(200).json(results);
        } else {
          return res.status(400).json({ error: "Không có người dùng" });
        }
      }
    );
  } else {
    const page = parseInt(req.params.slug) || 1;
    const limit = 5; // Số lượng người dùng hiển thị trên mỗi trang
    const offset = (page - 1) * limit; // Vị trí bắt đầu lấy dữ liệu

    connection.query(
      "SELECT id,username,birddate,name,avatar FROM Users WHERE role <> 'admin' LIMIT ? OFFSET ?",
      [limit, offset],
      function (err, results, fields) {
        if (err) {
          return res.status(500).json({ error: "Lỗi máy chủ" });
        }
        if (results.length > 0) {
          return res.status(200).json(results);
        } else {
          return res.status(400).json({ error: "Không có người dùng" });
        }
      }
    );
  }
};

module.exports = {
  login,
  register,
  forgotPassword,
  verifyToken,
  changeAvatar,
  UpdateInformationProfile,
  getDataUser,
  detail,
  listUsers,
};
