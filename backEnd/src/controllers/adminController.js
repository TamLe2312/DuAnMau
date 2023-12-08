const connection = require("../config/database");
const bcrypt = require("bcrypt");
const { log, error } = require("console");
const saltRounds = 10;
const fs = require("fs");
const path = require("path");

const getDataAllUser = (req, res) => {
  const page = parseInt(req.params.page) || 1; // Trang hiện tại
  const limit = 10; // Số lượng người dùng hiển thị trên mỗi trang
  const offset = (page - 1) * limit; // Vị trí bắt đầu lấy dữ liệu
  connection.query(
    `SELECT COUNT(*) AS total FROM Users`,
    async function (err, results, fields) {
      if (err) {
        return res.status(500).json({ error: "Lỗi máy chủ" });
      }
      const totalUsers = results[0].total;
      const pageCount = Math.ceil(totalUsers / limit);
      const query =
        "SELECT id, username, name, role FROM Users LIMIT ? OFFSET ?";
      connection.query(query, [limit, offset], function (err, results, fields) {
        if (err) {
          return res.status(500).json({ error: "Lỗi máy chủ" });
        }
        if (results.length > 0) {
          return res.status(200).json({ results, pageCount: pageCount });
        } else {
          return res.status(400).json({ error: "Người dùng không tồn tại" });
        }
      });
    }
  );
};
const getDataAllAds = (req, res) => {
  const page = parseInt(req.params.page) || 1; // Trang hiện tại
  const limit = 10; // Số lượng người dùng hiển thị trên mỗi trang
  const offset = (page - 1) * limit; // Vị trí bắt đầu lấy dữ liệu
  connection.query(
    `SELECT COUNT(*) AS total FROM advertisement`,
    async function (err, results, fields) {
      if (err) {
        return res.status(500).json({ error: "Lỗi máy chủ" });
      }
      const totalPosts = results[0].total;
      const pageCount = Math.ceil(totalPosts / limit);
      connection.query(
        `SELECT * FROM advertisement
        LIMIT ? OFFSET ?`,
        [limit, offset],
        async function (err, results, fields) {
          if (err) {
            return res.status(500).json({ error: "Lỗi máy chủ" });
          }
          if (results.length > 0) {
            return res.status(200).json({ pageCount: pageCount, results });
          } else {
            return res.status(200).json([]);
          }
        }
      );
    }
  );
};
const getDataAllPost = (req, res) => {
  const page = parseInt(req.params.page) || 1; // Trang hiện tại
  const limit = 10; // Số lượng người dùng hiển thị trên mỗi trang
  const offset = (page - 1) * limit; // Vị trí bắt đầu lấy dữ liệu
  connection.query(
    `SELECT COUNT(*) AS total FROM posts`,
    async function (err, results, fields) {
      if (err) {
        return res.status(500).json({ error: "Lỗi máy chủ" });
      }
      const totalPosts = results[0].total;
      const pageCount = Math.ceil(totalPosts / limit);
      connection.query(
        `SELECT posts.*, users.name, users.username
        FROM posts
        INNER JOIN users ON posts.user_id = users.id
        LIMIT ? OFFSET ?`,
        [limit, offset],
        async function (err, results, fields) {
          if (err) {
            return res.status(500).json({ error: "Lỗi máy chủ" });
          }
          if (results.length > 0) {
            return res.status(200).json({ pageCount: pageCount, results });
          } else {
            return res.status(400).json({ error: "Người dùng không tồn tại" });
          }
        }
      );
    }
  );
};
const getDataAllGroup = (req, res) => {
  const page = parseInt(req.params.page) || 1; // Trang hiện tại
  const limit = 10; // Số lượng người dùng hiển thị trên mỗi trang
  const offset = (page - 1) * limit; // Vị trí bắt đầu lấy dữ liệu
  connection.query(
    `SELECT COUNT(*) AS total FROM groupsTable`,
    async function (err, results, fields) {
      if (err) {
        return res.status(500).json({ error: "Lỗi máy chủ" });
      }
      const totalGroups = results[0].total;
      const pageCount = Math.ceil(totalGroups / limit);
      connection.query(
        `SELECT groupstable.id,groupstable.name,groupstable.moTaNhom,groupstable.avatarGroup, users.name AS nameUser,users.username AS usernameUser FROM groupstable
        INNER JOIN users on groupstable.idUserCreatedGroup = users.id
        LIMIT ? OFFSET ?
        `,
        [limit, offset],
        async function (err, results, fields) {
          if (err) {
            return res.status(500).json({ error: "Lỗi máy chủ" });
          }
          if (results.length > 0) {
            return res.status(200).json({ pageCount: pageCount, results });
          } else {
            return res.status(400).json({ error: "Nhóm không tồn tại" });
          }
        }
      );
    }
  );
};
const postImgs = (req, res) => {
  const idPost = req.params.id;
  if (idPost) {
    connection.query(
      "SELECT img FROM listdata WHERE post_id = ?",
      [idPost],
      async function (err, results, fields) {
        if (err) {
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
const getDataCreatedGroupUser = (req, res) => {
  const idUser = parseInt(req.params.id);
  if (idUser) {
    connection.query(
      "SELECT username,name FROM Users WHERE id = ?",
      [idUser],
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
  } else {
    return res.status(400).json({ error: "Người dùng không tồn tại" });
  }
};
const deleteUser = (req, res) => {
  const { idUser } = req.body;
  if (!idUser) {
    return res
      .status(400)
      .json({ error: "Id User không tồn tại hoặc không có" });
  }
  connection.query(
    "SELECT * FROM Users WHERE id = ?",
    [idUser],
    async function (err, results, fields) {
      if (err) {
        return res.status(500).json({ error: "Lỗi máy chủ" });
      }
      if (results.length > 0) {
        const url = results[0].avatar;
        connection.query(
          "DELETE FROM Users WHERE id = ?",
          [idUser],
          async function (err, results, fields) {
            if (err) {
              return res.status(500).json({ error: "Lỗi máy chủ" });
            }
            connection.query(
              `SELECT COUNT(*) AS total FROM Users`,
              async function (err, results, fields) {
                if (err) {
                  return res.status(500).json({ error: "Lỗi máy chủ" });
                }

                if (url) {
                  const modifiedUrl = url.replace(
                    "http://localhost:5173/uploads/",
                    ""
                  );
                  const uploadDir = path.join(
                    __dirname,
                    "../../../frontEnd/uploads"
                  );
                  const filePath = path.join(uploadDir, modifiedUrl);
                  fs.access(filePath, fs.constants.F_OK, (err) => {
                    if (err) {
                      console.error(err);
                      return res
                        .status(404)
                        .json({ error: "Tệp tin không tồn tại" });
                    }
                    // Xóa tệp tin
                    fs.unlink(filePath, (error) => {
                      if (error) {
                        // Lỗi khi xóa tệp tin, trả về lỗi hoặc thông báo lỗi xóa tệp tin
                        return res
                          .status(500)
                          .json({ error: "Lỗi khi xóa tệp tin" });
                      }
                    });
                  });
                  const totalUsers = results[0].total;
                  const pageCount = Math.ceil(totalUsers / 10);
                  return res.status(200).json({
                    pageCount: pageCount,
                    success: "Xóa user thành công",
                  });
                } else {
                  const totalUsers = results[0].total;
                  const pageCount = Math.ceil(totalUsers / 10);
                  return res.status(200).json({
                    pageCount: pageCount,
                    success: "Xóa user thành công",
                  });
                }
              }
            );
          }
        );
      } else {
        return res
          .status(400)
          .json({ error: "Id User không tồn tại hoặc không có" });
      }
    }
  );
};
const deleteGroup = (req, res) => {
  const { idGroup } = req.body;
  if (!idGroup) {
    return res
      .status(400)
      .json({ error: "Id group không tồn tại hoặc không có" });
  }
  connection.query(
    "SELECT * FROM groupsTable WHERE id = ?",
    [idGroup],
    async function (err, results, fields) {
      if (err) {
        return res.status(500).json({ error: "Lỗi máy chủ" });
      }
      if (results.length > 0) {
        const url = results[0].avatarGroup;
        connection.query(
          "DELETE FROM groupsTable WHERE id = ?",
          [idGroup],
          async function (err, results, fields) {
            if (err) {
              return res.status(500).json({ error: "Lỗi máy chủ" });
            }
            connection.query(
              `SELECT COUNT(*) AS total FROM groupsTable`,
              async function (err, results, fields) {
                if (err) {
                  return res.status(500).json({ error: "Lỗi máy chủ" });
                }
                if (url) {
                  const modifiedUrl = url.replace(
                    "http://localhost:5173/uploads/",
                    ""
                  );
                  const uploadDir = path.join(
                    __dirname,
                    "../../../frontEnd/uploads"
                  );
                  const filePath = path.join(uploadDir, modifiedUrl);
                  fs.access(filePath, fs.constants.F_OK, (err) => {
                    if (err) {
                      console.error(err);
                      return res
                        .status(404)
                        .json({ error: "Tệp tin không tồn tại" });
                    }
                    // Xóa tệp tin
                    fs.unlink(filePath, (error) => {
                      if (error) {
                        // Lỗi khi xóa tệp tin, trả về lỗi hoặc thông báo lỗi xóa tệp tin
                        return res
                          .status(500)
                          .json({ error: "Lỗi khi xóa tệp tin" });
                      }
                    });
                  });
                  const totalGroups = results[0].total;
                  const pageCount = Math.ceil(totalGroups / 10);
                  return res.status(200).json({
                    pageCount: pageCount,
                    success: "Xóa nhóm thành công",
                  });
                } else {
                  const totalGroups = results[0].total;
                  const pageCount = Math.ceil(totalGroups / 10);
                  return res.status(200).json({
                    pageCount: pageCount,
                    success: "Xóa nhóm thành công",
                  });
                }
              }
            );
          }
        );
      } else {
        return res
          .status(400)
          .json({ error: "Id group không tồn tại hoặc không có" });
      }
    }
  );
};
const AdjustInformUser = (req, res) => {
  const { nameUser, usernameUser, role, idUser } = req.body;
  if (!role) {
    return res.status(400).json({ error: "Vui lòng nhập role" });
  }
  if (!nameUser && !usernameUser) {
    connection.query(
      "UPDATE users set role = ? WHERE id = ?",
      [role, idUser],
      async function (err, results, fields) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Lỗi máy chủ" });
        }
        return res
          .status(200)
          .json({ success: "Cập nhật thông tin người dùng thành công" });
      }
    );
  } else if (!usernameUser) {
    connection.query(
      "UPDATE users set name = ?,role = ? WHERE id = ?",
      [nameUser, role, idUser],
      async function (err, results, fields) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Lỗi máy chủ" });
        }
        return res
          .status(200)
          .json({ success: "Cập nhật thông tin người dùng thành công" });
      }
    );
  } else {
    connection.query(
      "SELECT * FROM Users WHERE username = ?",
      [usernameUser],
      async function (err, results, fields) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Lỗi máy chủ" });
        }
        if (results.length > 0) {
          return res
            .status(400)
            .json({ error: "Tên username đã được sử dụng" });
        } else {
          connection.query(
            "UPDATE users set username = ?,role = ? WHERE id = ?",
            [usernameUser, role, idUser],
            async function (err, results, fields) {
              if (err) {
                console.error(err);
                return res.status(500).json({ error: "Lỗi máy chủ" });
              }
              return res
                .status(200)
                .json({ success: "Cập nhật thông tin người dùng thành công" });
            }
          );
        }
      }
    );
  }
};
const adjustGroupInformContent = (req, res) => {
  const { name, moTaNhom, idGroup } = req.body;
  if (name && moTaNhom) {
    connection.query(
      "SELECT * FROM groupsTable WHERE name = ?",
      [name],
      async function (err, results, fields) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Lỗi máy chủ" });
        }
        if (results.length > 0) {
          return res.status(400).json({ error: "Tên nhóm đã được sử dụng" });
        } else {
          connection.query(
            "UPDATE groupsTable set name = ?,moTaNhom = ? WHERE id = ?",
            [name, moTaNhom, idGroup],
            async function (err, results, fields) {
              if (err) {
                console.error(err);
                return res.status(500).json({ error: "Lỗi máy chủ" });
              }
              return res
                .status(200)
                .json({ success: "Cập nhật thông tin thành công" });
            }
          );
        }
      }
    );
  } else if (name) {
    connection.query(
      "SELECT * FROM groupsTable WHERE name = ?",
      [name],
      async function (err, results, fields) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Lỗi máy chủ" });
        }
        if (results.length > 0) {
          return res.status(400).json({ error: "Tên nhóm đã được sử dụng" });
        } else {
          connection.query(
            "UPDATE groupsTable set name = ? WHERE id = ?",
            [name, idGroup],
            async function (err, results, fields) {
              if (err) {
                console.error(err);
                return res.status(500).json({ error: "Lỗi máy chủ" });
              }
              return res
                .status(200)
                .json({ success: "Cập nhật thông tin thành công" });
            }
          );
        }
      }
    );
  } else if (moTaNhom) {
    connection.query(
      "UPDATE groupsTable set moTaNhom = ? WHERE id = ?",
      [moTaNhom, idGroup],
      async function (err, results, fields) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Lỗi máy chủ" });
        }
        return res
          .status(200)
          .json({ success: "Cập nhật thông tin thành công" });
      }
    );
  } else {
    return res
      .status(400)
      .json({ error: "Vui lòng điền ít nhất 1 trường thông tin" });
  }
};
const createNewUser = (req, res) => {
  const { username, password, Cpassword, email, role } = req.body;
  if (!username || !password || !Cpassword || !email || !role) {
    return res.status(400).json({ error: "Vui lòng nhập đầy đủ thông tin" });
  }
  if (password.length < 5 || Cpassword.length < 5) {
    return res.status(400).json({ error: "Mật khẩu phải trên 5 kí tự" });
  }
  if (password !== Cpassword) {
    return res.status(400).json({ error: "Mật khẩu không khớp" });
  }
  const myPlaintextPassword = password;
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
            connection.query(
              "INSERT INTO Users (username, password, email,role) VALUES (?, ?, ?,?)",
              [username, hash, email, role],
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
const createNewAds = (req, res) => {
  const { brand } = req.body;
  const files = req.files;
  if (req.files && brand) {
    connection.query(
      `SELECT * FROM advertisement WHERE brand = ?`,
      [brand],
      function (err, results, fields) {
        if (err) {
          res.status(500).json({ error: "Có lỗi xảy ra xin thử lại sau" });
        }
        if (results.length > 0) {
          const uploadDir = path.join(__dirname, "../../../frontEnd/uploads");
          files.forEach((file) => {
            const fileName = file.filename;
            const filePathOld = path.join(uploadDir, fileName);
            if (fs.existsSync(filePathOld)) {
              try {
                fs.unlinkSync(filePathOld);
              } catch (error) {
                return res.status(500).json({ error: "Lỗi khi xóa ảnh" });
              }
            }
          });
          res.status(200).json({ error: "Đã có thương hiệu,nội dung này" });
        } else {
          let completed = 0;
          files.forEach((file) => {
            const fileName = file.filename;
            const filePath = "/uploads/" + fileName;
            const baseURL = process.env.APP_URL;
            const imageURL = `${baseURL.slice(0, -1)}${filePath}`;
            connection.query(
              "INSERT INTO advertisement (brand,img) VALUES (?,?)",
              [brand, imageURL],
              function (err, results, fields) {
                completed++;
                if (err) {
                  return res
                    .status(500)
                    .json({ error: "Có lỗi xảy ra xin thử lại sau" });
                } else {
                  if (completed == files.length) {
                    return res
                      .status(200)
                      .json({ success: "Bạn đã tải hình ảnh lên" });
                  }
                }
              }
            );
          });
        }
      }
    );
  }
};

const adjustGroupInform = (req, res) => {
  const { hasAvatar, idGroup, avatar } = req.body;
  const fileName = req.file ? req.file.filename : null;
  if (fileName) {
    const filePath = "/uploads/" + fileName;
    const baseURL = "http://localhost:5173/";
    const imageURL = `${baseURL.slice(0, -1)}${filePath}`;
    const uploadDir = path.join(__dirname, "../../../frontEnd/uploads");
    const adjustedHasAvatar = hasAvatar.substring(
      "http:\\localhost:5173\\uploads\\".length
    );
    const filePathOldAvatar = path.join(uploadDir, adjustedHasAvatar);
    connection.query(
      "UPDATE groupsTable SET avatarGroup = ? WHERE id = ?",
      [imageURL, idGroup],
      function (err, results, fields) {
        if (err) {
          console.error(err);
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
        });
      }
    );
  } else {
    return res.status(400).json({ UpdateNoImg: "Không update ảnh" });
  }
};
const deletePost = (req, res) => {
  const idPost = req.body.idPost;
  if (idPost) {
    connection.query(
      "SELECT * FROM posts WHERE id = ?",
      [idPost],
      async function (err, results, fields) {
        if (err) {
          return res.status(500).json({ error: "Lỗi máy chủ" });
        }
        if (results.length > 0) {
          connection.query(
            "DELETE FROM posts WHERE id = ?",
            [idPost],
            function (err, results, fields) {
              if (err) {
                return res
                  .status(500)
                  .json({ error: "Có lỗi xảy ra xin thử lại sau" });
              }
              if (results) {
                connection.query(
                  `SELECT COUNT(*) AS total FROM posts`,
                  async function (err, results, fields) {
                    if (err) {
                      return res.status(500).json({ error: "Lỗi máy chủ" });
                    }
                    const totalPosts = results[0].total;
                    const pageCount = Math.ceil(totalPosts / 10);
                    return res.status(200).json({
                      pageCount: pageCount,
                      success: "Xóa bài viết thành công",
                    });
                  }
                );
              }
            }
          );
        } else {
          return res
            .status(400)
            .json({ error: "Id posts không tồn tại hoặc không có" });
        }
      }
    );
  } else {
    return res.status(400).json({ error: "Id Post không tồn tại" });
  }
};
const deleteAds = (req, res) => {
  const idAds = req.body.idAds;
  if (idAds) {
    connection.query(
      "SELECT * FROM advertisement WHERE id = ?",
      [idAds],
      async function (err, results, fields) {
        if (err) {
          return res.status(500).json({ error: "Lỗi máy chủ" });
        }
        if (results.length > 0) {
          connection.query(
            "DELETE FROM advertisement WHERE id = ?",
            [idAds],
            function (err, results, fields) {
              if (err) {
                return res
                  .status(500)
                  .json({ error: "Có lỗi xảy ra xin thử lại sau" });
              }
              if (results) {
                connection.query(
                  `SELECT COUNT(*) AS total FROM advertisement`,
                  async function (err, results, fields) {
                    if (err) {
                      return res.status(500).json({ error: "Lỗi máy chủ" });
                    }
                    const totalPosts = results[0].total;
                    const pageCount = Math.ceil(totalPosts / 10);
                    return res.status(200).json({
                      pageCount: pageCount,
                      success: "Xóa bài viết thành công",
                    });
                  }
                );
              }
            }
          );
        } else {
          return res.status(200).json([]);
        }
      }
    );
  } else {
    return res.status(200).json([]);
  }
};
const deletePostImgs = async (req, res) => {
  const uploadDir = path.join(__dirname, "../public/images/");
  const { idPost } = req.body;
  const listImg = await new Promise((resolve, reject) => {
    connection.query(
      "SELECT * FROM listdata WHERE post_id = ?",
      [idPost],
      (err, results, fields) => {
        if (err) {
          reject(err);
        } else {
          const imgPaths = results.map((re) => path.join(uploadDir, re.img));
          resolve(imgPaths);
        }
      }
    );
  });

  if (listImg.length === 0) {
    return res.status(200).json({ success: "Bài viết không có hình ảnh" });
  }
  try {
    await Promise.all(
      listImg.map((imgdel) => {
        return new Promise((resolve, reject) => {
          fs.unlink(imgdel, (err) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
        });
      })
    );
    return res.status(200).json({
      successWithImgs:
        "Bạn đã xóa bài viết thành công.Vui lòng cập nhật lại thông tin",
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: "Lỗi xóa hình ảnh" });
  }
};

module.exports = {
  getDataAllUser,
  getDataAllPost,
  getDataAllAds,
  deleteUser,
  AdjustInformUser,
  createNewUser,
  getDataAllGroup,
  getDataCreatedGroupUser,
  deleteGroup,
  adjustGroupInform,
  adjustGroupInformContent,
  postImgs,
  deletePost,
  deleteAds,
  deletePostImgs,
  createNewAds,
};
