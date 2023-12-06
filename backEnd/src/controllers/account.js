const connection = require("../config/database");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const mailer = require("../utils/mailer");
const Mustache = require("mustache");
const fs = require("fs");
const path = require("path");
const moment = require("moment");
require("dotenv").config();

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
          } else {
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
        }
      );
    }
  });
};

const login = (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Vui lòng nhập đầy đủ thông tin" });
  }
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
          let uId = results[0].id;
          return res
            .status(200)
            .json({ id: uId, error: "Đăng nhập thành công" });
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
          return res
            .status(400)
            .json({ error: "Có lỗi xảy ra. Vui lòng thử lại" });
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
  const { hasAvatar, id } = req.body;
  if (req.file) {
    const fileName = req.file.filename;
    const filePath = "/uploads/" + fileName;
    const baseURL = process.env.APP_URL;
    const imageURL = `${baseURL.slice(0, -1)}${filePath}`;

    const uploadDir = path.join(__dirname, "../../../frontEnd/uploads");
    const filePathOldAvatar = path.join(uploadDir, hasAvatar);
    connection.query(
      "UPDATE Users SET avatar = ? WHERE id = ?",
      [imageURL, id],
      function (err, results, fields) {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: "Lỗi máy chủ" });
        }
        if (fs.existsSync(filePathOldAvatar)) {
          // Xóa tệp tin cũ
          try {
            fs.unlinkSync(filePathOldAvatar);
          } catch (error) {
            return res.status(500).json({ error: "Lỗi khi cập nhật avatar" });
          }
        }
        return res.status(200).json({
          success: "Cập nhật avatar thành công",
          avatar: imageURL,
          fileName: fileName,
          filePath: filePath,
          id: id,
        });
      }
    );
  }
};

const RemoveAvatar = (req, res) => {
  const { imagePath, id } = req.body;
  const uploadDir = path.join(__dirname, "../../../frontEnd/uploads");
  const filePath = path.join(uploadDir, imagePath);
  connection.query(
    "UPDATE users SET avatar = NULL WHERE id = ?",
    [id],
    async function (err, results, fields) {
      if (err) {
        return res.status(500).json({ error: "Lỗi máy chủ" });
      }
      // Kiểm tra xem tệp tin có tồn tại hay không
      fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
          // Tệp tin không tồn tại, trả về lỗi hoặc thông báo không tìm thấy tệp tin
          return res.status(404).json({ error: "Tệp tin không tồn tại" });
        }
        // Xóa tệp tin
        fs.unlink(filePath, (error) => {
          if (error) {
            // Lỗi khi xóa tệp tin, trả về lỗi hoặc thông báo lỗi xóa tệp tin
            return res.status(500).json({ error: "Lỗi khi xóa tệp tin" });
          }

          // Xóa thành công, trả về thông báo thành công hoặc mã thành công
          return res.status(200).json({ success: "Xóa ảnh thành công" });
        });
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
};
const CountPost = (req, res) => {
  const userId = req.params.userId;
  connection.query(
    "SELECT COUNT(user_id) as CountPosts FROM posts WHERE user_id = ?",
    [userId],
    async function (err, results, fields) {
      if (err) {
        console.error(err);
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

const UpdateInformationProfile = (req, res) => {
  const { name, moTa, date, id, province, district, wards } = req.body;
  if (!name && !moTa && !province && !district && !wards) {
    const formattedDate = moment(date).format("YYYY-MM-DD");
    connection.query(
      "UPDATE Users SET birddate = ? WHERE id = ?",
      [formattedDate, id],
      function (err, results, fields) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Lỗi máy chủ" });
        }
        connection.query(
          "SELECT name,username,moTa FROM Users WHERE id = ?",
          [id],
          function (err, results, fields) {
            if (err) {
              console.error(err);
              return res.status(500).json({ error: "Lỗi máy chủ" });
            }
            return res.status(200).json({
              name: results[0].name,
              moTa: results[0].moTa,
              username: results[0].username,
              success: "Cập nhật thông tin thành công",
            });
          }
        );
      }
    );
  } else if (!name && !date && !province && !district && !wards) {
    connection.query(
      "UPDATE Users SET moTa = ? WHERE id = ?",
      [moTa, id],
      function (err, results, fields) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Lỗi máy chủ" });
        }
        connection.query(
          "SELECT name,username,moTa FROM Users WHERE id = ?",
          [id],
          function (err, results, fields) {
            if (err) {
              console.error(err);
              return res.status(500).json({ error: "Lỗi máy chủ" });
            }
            return res.status(200).json({
              name: results[0].name,
              moTa: results[0].moTa,
              username: results[0].username,
              success: "Cập nhật thông tin thành công",
            });
          }
        );
      }
    );
  } else if (!name && !moTa && !date) {
    const address = wards + " " + district + " " + province;
    console.log(address);
    connection.query(
      "UPDATE Users SET address = ? WHERE id = ?",
      [address, id],
      function (err, results, fields) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Lỗi máy chủ" });
        }
        connection.query(
          "SELECT name,username,moTa FROM Users WHERE id = ?",
          [id],
          function (err, results, fields) {
            if (err) {
              console.error(err);
              return res.status(500).json({ error: "Lỗi máy chủ" });
            }
            console.log("OK");
            return res.status(200).json({
              name: results[0].name,
              moTa: results[0].moTa,
              username: results[0].username,
              success: "Cập nhật thông tin thành công",
            });
          }
        );
      }
    );
  }
  if (name) {
    connection.query(
      "UPDATE Users SET name = ? WHERE id = ?",
      [name, id],
      function (err, results, fields) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Lỗi máy chủ" });
        }
        connection.query(
          "SELECT name,username,moTa FROM Users WHERE id = ?",
          [id],
          function (err, results, fields) {
            if (err) {
              console.error(err);
              return res.status(500).json({ error: "Lỗi máy chủ" });
            }
            return res.status(200).json({
              name: results[0].name,
              moTa: results[0].moTa,
              username: results[0].username,
              success: "Cập nhật thông tin thành công",
            });
          }
        );
      }
    );
  }
};

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
      if (results) {
        return res.status(200).json(results);
      }
    }
  );
};

const listUsers = (req, res) => {
  if (req.params.slug == 0) {
    const limit = 5; // Số lượng người dùng hiển thị trên mỗi trang
    connection.query(
      "SELECT id,username,birddate,name,avatar,moTa FROM Users WHERE role <> 'admin' ORDER BY RAND() LIMIT ?",
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
      "SELECT id,username,birddate,name,avatar,moTa FROM Users WHERE role <> 'admin' ORDER BY id DESC LIMIT ? OFFSET ?",
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
const ChangePassword = (req, res) => {
  const { OldPassword, NewPassword, NewConfirmPassword, id } = req.body;
  if (!OldPassword || !NewPassword || !NewConfirmPassword) {
    return res
      .status(400)
      .json({ error: "Không được bỏ trống trường thông tin" });
  }
  if (NewPassword !== NewConfirmPassword) {
    return res
      .status(400)
      .json({ error: "Mật khẩu mới và mật khẩu xác nhận phải giống nhau" });
  }
  connection.query(
    "SELECT * FROM Users WHERE id = ?",
    [id],
    async function (err, results, fields) {
      if (err) {
        return res.status(500).json({ error: "Lỗi máy chủ" });
      }
      if (results.length > 0) {
        const match = await bcrypt.compare(OldPassword, results[0].password);
        if (match) {
          const myPlaintextPassword = NewPassword;
          bcrypt.hash(myPlaintextPassword, saltRounds, function (err, hash) {
            if (!err) {
              connection.query(
                "UPDATE Users SET password = ? WHERE id = ?",
                [hash, id],
                function (err, results, fields) {
                  if (err) {
                    return res.status(500).json({ error: "Lỗi máy chủ" });
                  }
                  return res
                    .status(200)
                    .json({ success: "Cập nhật mật khẩu thành công" });
                }
              );
            }
          });
        } else {
          return res.status(400).json({ error: "Sai mật khẩu đăng nhập" });
        }
      } else {
        return res.status(400).json({ error: "Lỗi máy chủ" });
      }
    }
  );
};
const postProfileUser = (req, res) => {
  const id = parseInt(req.params.id);
  const page = parseInt(req.params.page) || 1;
  const limit = 4; // Số lượng người dùng hiển thị trên mỗi trang
  const offset = (page - 1) * limit; // Vị trí bắt đầu lấy dữ liệu
  connection.query(
    `SELECT posts.id,posts.content,posts.created_at,users.id as userid, users.username,users.avatar,users.name
    FROM posts  
    JOIN users ON posts.user_id = users.id
    WHERE posts.user_id = ?
    ORDER BY posts.id DESC
    LIMIT ? OFFSET ?
    `,
    [id, limit, offset],
    function (err, results, fields) {
      if (err) {
        return res.status(500).json({ error: "Có lỗi xảy ra xin thử lại sau" });
      }
      if (results) {
        return res.status(200).json(results);
      }
    }
  );
};
const FollowUser = (req, res) => {
  const { follower_id, followed_id } = req.body;
  if ((followed_id, follower_id)) {
    connection.query(
      `INSERT INTO follows (follower_id,followed_id) VALUES (? , ?)
    `,
      [follower_id, followed_id],
      function (err, results, fields) {
        if (err) {
          return res
            .status(500)
            .json({ error: "Có lỗi xảy ra xin thử lại sau" });
        }
        return res.status(200).json({ success: "Follow thành công" });
      }
    );
  } else {
    return res
      .status(400)
      .json({ error: "Có lỗi xảy ra.Không có follower_id và followed_id" });
  }
};
const UnfollowUser = (req, res) => {
  const { follower_id, followed_id } = req.body;
  if ((followed_id, follower_id)) {
    connection.query(
      `DELETE FROM follows WHERE follower_id = ? AND followed_id = ?
    `,
      [follower_id, followed_id],
      function (err, results, fields) {
        if (err) {
          console.error(err);
          return res
            .status(500)
            .json({ error: "Có lỗi xảy ra xin thử lại sau" });
        }
        return res.status(200).json({ success: "Unfollow thành công" });
      }
    );
  } else {
    return res
      .status(400)
      .json({ error: "Có lỗi xảy ra.Không có follower_id và followed_id" });
  }
};
const FollowerData = (req, res) => {
  const page = req.params.page || 1;
  const idUser = parseInt(req.params.id);
  if (idUser) {
    if (page != 0) {
      const limit = 5;
      const offset = (page - 1) * limit;
      connection.query(
        `SELECT users.id, users.name, users.username, users.avatar
FROM follows
INNER JOIN users ON follows.follower_id = users.id
WHERE follows.followed_id = ?
LIMIT ? OFFSET ?`,
        [idUser, limit, offset],
        function (err, results, fields) {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: "Lỗi máy chủ" });
          }
          if (results.length > 0) {
            return res.status(200).json(results);
          } else {
            return res.status(200).json([]);
          }
        }
      );
    } else {
      connection.query(
        `SELECT users.id, users.name, users.username, users.avatar
FROM follows
INNER JOIN users ON follows.follower_id = users.id
WHERE follows.followed_id = ?`,
        [idUser],
        function (err, results, fields) {
          if (err) {
            console.error(err);
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
  } else {
    return res.status(400).json({ error: "Không có Id User" });
  }
};
const FollowedData = (req, res) => {
  const page = req.params.page || 1;
  const idUser = parseInt(req.params.id);
  if (idUser) {
    if (page != 0) {
      const limit = 5;
      const offset = (page - 1) * limit;
      connection.query(
        `SELECT users.id, users.name, users.username, users.avatar,follows.follower_id
FROM follows
INNER JOIN users ON follows.followed_id = users.id
WHERE follows.follower_id = ?
LIMIT ? OFFSET ?`,
        [idUser, limit, offset],
        function (err, results, fields) {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: "Lỗi máy chủ" });
          }
          if (results.length > 0) {
            return res.status(200).json(results);
          } else {
            return res.status(200).json([]);
          }
        }
      );
    } else {
      connection.query(
        `SELECT users.id, users.name, users.username, users.avatar
FROM follows
INNER JOIN users ON follows.followed_id = users.id
WHERE follows.follower_id = ?`,
        [idUser],
        function (err, results, fields) {
          if (err) {
            console.error(err);
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
  } else {
    return res.status(400).json({ error: "Không có Id User" });
  }
};
const isFollowed = (req, res) => {
  const idUser = parseInt(req.params.id);
  if (idUser) {
    connection.query(
      `SELECT users.id, users.name, users.username, users.avatar,follows.followed_id
FROM follows
INNER JOIN users ON follows.followed_id = users.id
WHERE follows.follower_id = ?`,
      [idUser],
      function (err, results, fields) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Lỗi máy chủ" });
        }
        if (results.length > 0) {
          return res.status(200).json(results);
        } else {
          return res.status(200).json([]);
        }
      }
    );
  }
};
const suggestFollow = (req, res) => {
  const idUser = parseInt(req.params.id);
  const limit = parseInt(req.params.limit) || 5;

  if (idUser) {
    connection.query(
      "SELECT address FROM users WHERE id = ?",
      [idUser],
      function (err, addressResults, fields) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Lỗi máy chủ" });
        }

        if (addressResults.length > 0 && addressResults[0].address !== null) {
          // If idUser has an address
          connection.query(
            "SELECT id, username, name, avatar, address FROM users WHERE id <> ? AND id NOT IN (SELECT followed_id FROM follows WHERE follower_id = ?) AND address = ? ORDER BY RAND() LIMIT ?",
            [idUser, idUser, addressResults[0].address, limit],
            function (err, results, fields) {
              if (err) {
                console.error(err);
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
          // If idUser does not have an address or the address is null
          connection.query(
            "SELECT id, username, name, avatar, address FROM users WHERE id <> ? AND id NOT IN (SELECT followed_id FROM follows WHERE follower_id = ?) ORDER BY RAND() LIMIT ?",
            [idUser, idUser, limit],
            function (err, results, fields) {
              if (err) {
                console.error(err);
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
      }
    );
  }
};

const countFollow = (req, res) => {
  const idUser = parseInt(req.params.userId);
  connection.query(
    `SELECT
    (SELECT COUNT(*) FROM follows WHERE followed_id = ?) AS followerCount,
    (SELECT COUNT(*) FROM follows WHERE follower_id = ?) AS followingCount
`,
    [idUser, idUser],
    function (err, results, fields) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Lỗi máy chủ" });
      }
      if (results.length > 0) {
        return res.status(200).json(results);
      } else {
        return res.status(400).json({ error: "Không có người dùng" });
      }
    }
  );
};
const searchUserFollower = (req, res) => {
  console.log(req.body);
  const searchValue = req.body.searchUser || null;
  const idUser = req.body.idUser;
  if (searchValue) {
    connection.query(
      `SELECT u.* 
    FROM users u
    INNER JOIN follows f ON u.id = f.follower_id
    WHERE (u.name LIKE CONCAT('%', ?, '%') OR u.username LIKE CONCAT('%', ?, '%'))
    AND f.followed_id = ?`,
      [searchValue, searchValue, idUser],
      async function (err, results, fields) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Lỗi máy chủ" });
        }
        if (results.length > 0) {
          return res.status(200).json(results);
        } else {
          return res.status(200).json([]);
        }
      }
    );
  } else {
    return res.status(200).json([]);
  }
};
const searchUserFollowed = (req, res) => {
  const searchFollowed = req.body.searchFollowed;
  const idUser = req.body.idUser;
  if (searchFollowed) {
    connection.query(
      `SELECT u.*,f.follower_id 
    FROM users u
    INNER JOIN follows f ON u.id = f.followed_id
    WHERE (u.name LIKE CONCAT('%', ?, '%') OR u.username LIKE CONCAT('%', ?, '%'))
    AND f.follower_id = ?`,
      [searchFollowed, searchFollowed, idUser],
      function (err, results, fields) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Lỗi máy chủ" });
        }
        if (results.length > 0) {
          return res.status(200).json(results);
        } else {
          return res.status(200).json([]);
        }
      }
    );
  } else {
    return res.status(200).json([]);
  }
};
const searchUserProfile = (req, res) => {
  const searchValue = req.params.value;
  const excludedUserId = req.params.id;

  if (searchValue) {
    connection.query(
      `SELECT * FROM users
       WHERE (username LIKE CONCAT('%', ?, '%') OR name LIKE CONCAT('%', ?, '%'))
       AND id <> ?`,
      [searchValue, searchValue, excludedUserId],
      async function (err, results, fields) {
        if (err) {
          console.error(err);
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
};
const FindArena = (req, res) => {
  const { id, address } = req.body;
  const limit = 20;
  if (id) {
    connection.query(
      "SELECT id, username, name, avatar, address FROM users WHERE id <> ? AND id NOT IN (SELECT followed_id FROM follows WHERE follower_id = ?) AND LOWER(address) LIKE ? ORDER BY RAND() LIMIT ?",
      [id, id, `%${address}%`, limit],
      function (err, results, fields) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Lỗi máy chủ" });
        }
        if (results.length > 0) {
          return res.status(200).json(results);
        } else {
          return res.status(200).json([]);
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
  RemoveAvatar,
  ChangePassword,
  postProfileUser,
  CountPost,
  FollowUser,
  UnfollowUser,
  FollowerData,
  FollowedData,
  isFollowed,
  suggestFollow,
  countFollow,
  searchUserFollower,
  searchUserFollowed,
  searchUserProfile,
  FindArena,
};
