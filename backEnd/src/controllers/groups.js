const connection = require("../config/database");
const path = require("path");
const bcrypt = require("bcrypt");
const saltRounds = 10;
require("dotenv").config();
const Mustache = require("mustache");
const fs = require("fs");
const schedule = require("node-schedule");
const moment = require("moment");
const { group } = require("console");

const createGroup = (req, res) => {
  const { name, moTa, idCreatedGroup, privacy } = req.body;
  const fileName = req.file.filename;
  if (!name || !moTa || !fileName || !privacy) {
    return res.status(400).json({ error: "Vui lòng nhập đủ thông tin" });
  }
  const filePath = "/uploads/" + fileName;
  const baseURL = process.env.APP_URL;
  const imageURL = `${baseURL}${filePath}`;
  connection.query(
    "SELECT * FROM groupsTable WHERE name = ?",
    [name],
    async function (err, results, fields) {
      if (err) {
        return res.status(500).json({ error: "Lỗi máy chủ" });
      }
      if (results.length > 0) {
        return res
          .status(400)
          .json({ error: "Tên nhóm đã tồn tại.Vui lòng nhập tên khác" });
      } else {
        connection.query(
          "INSERT INTO groupsTable (name, moTaNhom, avatarGroup,idUserCreatedGroup,privacy) VALUES (?, ?, ?,?,?)",
          [name, moTa, imageURL, idCreatedGroup, privacy],
          function (err, results, fields) {
            if (err) {
              console.error(err);
              return res.status(500).json({ error: "Lỗi máy chủ 2" });
            }
            const groupId = results.insertId;
            connection.query(
              "SELECT * FROM groupsTable",
              async function (err, results, fields) {
                if (err) {
                  return res.status(500).json({ error: "Lỗi máy chủ" });
                }
                if (results.length > 0) {
                  connection.query(
                    "INSERT INTO membergroup (group_id,user_id) VALUES (?, ?)",
                    [groupId, idCreatedGroup],
                    async function (err, results, fields) {
                      if (err) {
                        return res.status(500).json({ error: "Lỗi máy chủ" });
                      }
                    }
                  );
                  return res
                    .status(200)
                    .json({ results, success: "Tạo nhóm thành công" });
                } else {
                  return res.status(400).json({ error: "Lỗi máy chủ" });
                }
              }
            );
          }
        );
      }
    }
  );
};
const getDataGroup = (req, res) => {
  const id = req.params.idUser;
  connection.query(
    "SELECT groupsTable.* FROM groupsTable " +
      "LEFT JOIN membergroup ON groupsTable.id = membergroup.group_id " +
      "WHERE groupsTable.privacy = 'public' OR (groupsTable.privacy = 'private' AND membergroup.user_id = ?) " +
      "ORDER BY RAND() LIMIT 10",
    [id],
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
};

const searchGroup = (req, res) => {
  const searchValue = req.body.searchValue;
  if (searchValue) {
    connection.query(
      "SELECT * FROM groupsTable WHERE name LIKE CONCAT('%', ?, '%')",
      [searchValue],
      async function (err, results, fields) {
        if (err) {
          return res.status(500).json({ error: "Lỗi máy chủ" });
        }
        if (results.length > 0) {
          return res.status(200).json(results);
        } else {
          return res.status(400).json({ error: "Group không tồn tại" });
        }
      }
    );
  } else {
    return res.status(200).json([]);
  }
};
const getDataGroupProfile = (req, res) => {
  const groupIdProfile = req.params.groupId;
  if (!groupIdProfile) {
    return res.status(400).json({ error: "Không có group ID" });
  }
  connection.query(
    "SELECT * FROM groupsTable WHERE id = ?",
    [groupIdProfile],
    async function (err, results, fields) {
      if (err) {
        return res.status(500).json({ error: "Lỗi máy chủ" });
      }
      if (results.length > 0) {
        return res.status(200).json(results);
      } else {
        return res.status(400).json({ error: "Group không tồn tại" });
      }
    }
  );
};
const changeAvatarGroup = (req, res) => {
  const { hasAvatarGroup, groupId } = req.body;
  const fileName = req.file.filename;
  const filePath = "/uploads/" + fileName;
  const baseURL = "http://localhost:5173/";
  const imageURL = `${baseURL.slice(0, -1)}${filePath}`;
  const uploadDir = path.join(__dirname, "../../../frontEnd/uploads");
  const filePathOldAvatar = path.join(uploadDir, hasAvatarGroup);
  connection.query(
    "UPDATE groupsTable SET avatarGroup = ? WHERE id = ?",
    [imageURL, groupId],
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
        avatarGroup: imageURL,
        fileName: fileName,
        filePath: filePath,
        id: groupId,
      });
    }
  );
};
const removeAvatarGroup = (req, res) => {
  const { imagePath, groupIdProfile } = req.body;
  const uploadDir = path.join(__dirname, "../../../frontEnd/uploads");
  const filePath = path.join(uploadDir, imagePath);
  connection.query(
    "UPDATE groupsTable SET avatarGroup = NULL WHERE id = ?",
    [groupIdProfile],
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
const UpdateInformationProfileGroup = (req, res) => {
  const { name, moTaNhom, groupId, privacy } = req.body;
  if (!moTaNhom && !privacy) {
    connection.query(
      "SELECT * FROM groupsTable WHERE name = ?",
      [name],
      async function (err, results, fields) {
        if (err) {
          return res.status(500).json({ error: "Lỗi máy chủ" });
        }
        if (results.length > 0) {
          return res
            .status(400)
            .json({ error: "Tên nhóm đã tồn tại.Vui lòng nhập tên khác" });
        } else {
          connection.query(
            "UPDATE groupsTable SET name = ? WHERE id = ?",
            [name, groupId],
            function (err, results, fields) {
              if (err) {
                console.error(err);
                return res.status(500).json({ error: "Lỗi máy chủ" });
              }
              connection.query(
                "SELECT name,moTaNhom FROM groupsTable WHERE id = ?",
                [groupId],
                function (err, results, fields) {
                  if (err) {
                    console.error(err);
                    return res.status(500).json({ error: "Lỗi máy chủ" });
                  }
                  return res.status(200).json({
                    name: results[0].name,
                    moTaNhom: results[0].moTaNhom,
                    privacy: results[0].privacy,
                    success: "Cập nhật thông tin thành công",
                  });
                }
              );
            }
          );
        }
      }
    );
  } else if (!name && !privacy) {
    connection.query(
      "UPDATE groupsTable SET moTaNhom = ? WHERE id = ?",
      [moTaNhom, groupId],
      function (err, results, fields) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Lỗi máy chủ" });
        }
        connection.query(
          "SELECT name,moTaNhom FROM groupsTable WHERE id = ?",
          [groupId],
          function (err, results, fields) {
            if (err) {
              console.error(err);
              return res.status(500).json({ error: "Lỗi máy chủ" });
            }
            return res.status(200).json({
              name: results[0].name,
              moTaNhom: results[0].moTaNhom,
              privacy: results[0].privacy,
              success: "Cập nhật thông tin thành công",
            });
          }
        );
      }
    );
  } else {
    connection.query(
      "UPDATE groupsTable SET privacy = ? WHERE id = ?",
      [privacy, groupId],
      function (err, results, fields) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Lỗi máy chủ" });
        }
        connection.query(
          "SELECT name,moTaNhom,privacy FROM groupsTable WHERE id = ?",
          [groupId],
          function (err, results, fields) {
            if (err) {
              console.error(err);
              return res.status(500).json({ error: "Lỗi máy chủ" });
            }
            return res.status(200).json({
              name: results[0].name,
              moTaNhom: results[0].moTaNhom,
              privacy: results[0].privacy,
              success: "Cập nhật thông tin thành công",
            });
          }
        );
      }
    );
  }
};
const removeGroup = (req, res) => {
  const { hasAvatarGroup, groupIdProfile } = req.body;
  const uploadDir = path.join(__dirname, "../../../frontEnd/uploads");
  const filePath = path.join(uploadDir, hasAvatarGroup);
  connection.query(
    "DELETE FROM groupstable WHERE id = ?",
    [groupIdProfile],
    function (err, results, fields) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Lỗi máy chủ" });
      }
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
        });
      });
      return res.status(200).json({ success: "Xóa group thành công" });
    }
  );
};
const getDataGroupJoined = (req, res) => {
  const idUser = parseInt(req.params.idUser);
  connection.query(
    "SELECT * FROM membergroup WHERE user_id = ? ",
    [idUser],
    async function (err, results, fields) {
      if (err) {
        return res.status(500).json({ error: "Lỗi máy chủ" });
      }
      if (results.length > 0) {
        return res.status(200).json(results);
      } else {
        return res.status(400).json([]);
      }
    }
  );
};
const joinGroup = (req, res) => {
  const { groupId, idUser } = req.body;
  connection.query(
    "INSERT INTO membergroup (group_id,user_id) VALUES (?,?)",
    [groupId, idUser],
    async function (err, results, fields) {
      if (err) {
        return res.status(500).json({ error: "Lỗi máy chủ" });
      }
      connection.query(
        "SELECT * FROM membergroup",
        async function (err, results, fields) {
          if (err) {
            return res.status(500).json({ error: "Lỗi máy chủ" });
          }
          if (results.length > 0) {
            return res
              .status(200)
              .json({ results, success: "Vào nhóm thành công" });
          } else {
            return res
              .status(400)
              .json({ error: "Không có dữ liệu Member Group" });
          }
        }
      );
    }
  );
};
const outGroup = (req, res) => {
  const { groupId, idUser } = req.body;
  connection.query(
    "SELECT * FROM groupstable WHERE id = ?",
    [groupId],
    async function (err, results, fields) {
      if (err) {
        return res.status(500).json({ error: "Lỗi máy chủ" });
      }
      if (results.length > 0) {
        if (results[0].idUserCreatedGroup === idUser) {
          return res
            .status(400)
            .json({ error: "Bạn là admin không thể rời nhóm" });
        } else {
          connection.query(
            "DELETE FROM membergroup WHERE group_id = ? AND user_id = ?",
            [groupId, idUser],
            async function (err, results, fields) {
              if (err) {
                return res.status(500).json({ error: "Lỗi máy chủ" });
              }
              connection.query(
                "SELECT * FROM membergroup",
                async function (err, results, fields) {
                  if (err) {
                    return res.status(500).json({ error: "Lỗi máy chủ" });
                  }
                  if (results.length > 0) {
                    return res
                      .status(200)
                      .json({ results, success: "Rời nhóm thành công" });
                  } else {
                    return res
                      .status(400)
                      .json({ error: "Không có dữ liệu Member Group" });
                  }
                }
              );
            }
          );
        }
      } else {
        return res.status(400).json({ error: "Group không tồn tại" });
      }
    }
  );
};
const TotalMembers = (req, res) => {
  const groupId = parseInt(req.params.groupId);
  const userId = parseInt(req.params.userId || null);
  connection.query(
    "SELECT COUNT(*) as totalMembers FROM membergroup WHERE group_id = ?",
    [groupId],
    async function (err, results, fields) {
      if (err) {
        return res.status(500).json({ error: "Lỗi máy chủ" });
      }
      if (results.length > 0) {
        if (userId) {
          connection.query(
            "SELECT * FROM membergroup WHERE user_id = ? AND group_id = ?",
            [userId, groupId],
            async function (err, results1, fields) {
              if (err) {
                return res.status(500).json({ error: "Lỗi máy chủ" });
              }
              if (results1.length > 0) {
                return res.status(200).json({ hasJoined: true, results });
              } else {
                return res.status(400).json({
                  hasJoined: false,
                  error: "Không có dữ liệu Member Group",
                });
              }
            }
          );
        }
      } else {
        return res.status(400).json({ error: "Nhóm không tồn tại" });
      }
    }
  );
};
const CountPostGroup = (req, res) => {
  const groupId = parseInt(req.params.groupId);
  connection.query(
    "SELECT COUNT(*) as countPostGroup FROM postsgroup WHERE group_id = ?",
    [groupId],
    async function (err, results, fields) {
      if (err) {
        return res.status(500).json({ error: "Lỗi máy chủ" });
      }
      if (results.length > 0) {
        return res.status(200).json({ results });
      } else {
        return res.status(400).json({ error: "Lỗi đếm bài viết group" });
      }
    }
  );
};
const postGroupData = (req, res) => {
  const groupId = parseInt(req.params.groupId);
  const page = parseInt(req.params.page) || 1;
  const limit = 4; // Số lượng người dùng hiển thị trên mỗi trang
  const offset = (page - 1) * limit; // Vị trí bắt đầu lấy dữ liệu
  connection.query(
    `SELECT postsgroup.id,postsgroup.group_id,postsgroup.content,postsgroup.created_at,user_id as userid, users.username,users.avatar,users.name
      FROM postsgroup
      JOIN users ON postsgroup.user_id = users.id
      WHERE postsgroup.group_id = ?
      ORDER BY postsgroup.id DESC
      LIMIT ? OFFSET ?
      `,
    [groupId, limit, offset],
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
const invitationCode = (req, res) => {
  const groupId = req.params.groupId;

  if (groupId) {
    connection.query(
      `SELECT invitationCode FROM groupsTable WHERE id = ?
      `,
      [groupId],
      function (err, results, fields) {
        if (err) {
          return res
            .status(500)
            .json({ error: "Có lỗi xảy ra xin thử lại sau" });
        }
        if (results.length > 0) {
          const invitationCode = results[0].invitationCode;
          if (invitationCode !== null) {
            return res.status(200).json(invitationCode);
          } else {
            bcrypt.hash(groupId, saltRounds, function (err, hash) {
              if (!err) {
                const alphanumericHash = hash.replace(/[^a-zA-Z0-9]/g, "");
                let shortCode = alphanumericHash.slice(0, 10);

                connection.query(
                  "UPDATE groupsTable SET invitationCode = ? WHERE id = ?",
                  [shortCode, groupId],
                  function (err, results, fields) {
                    if (err) {
                      console.log(err);
                      return res
                        .status(500)
                        .json({ error: "Có lỗi xảy ra xin thử lại sau" });
                    }

                    // Schedule a one-time execution after 1 day
                    const delayInDays = 1;
                    const job = schedule.scheduleJob(
                      {
                        start: new Date(Date.now() + 86400000 * delayInDays),
                        rule: "*/1 * * * *",
                      },
                      function () {
                        const oneDayAgo = new Date();
                        oneDayAgo.setDate(oneDayAgo.getDate() - delayInDays);

                        const updateQuery =
                          "UPDATE groupsTable SET invitationCode = null WHERE createdCode < ? AND id = ?";
                        connection.query(
                          updateQuery,
                          [oneDayAgo, groupId],
                          (err, results) => {
                            if (err) {
                              console.error("Error updating old data:", err);
                            }
                          }
                        );
                      }
                    );
                    return res.status(200).json(shortCode);
                  }
                );
              }
            });
          }
        }
      }
    );
  }
};
const getInviteDataGroup = (req, res) => {
  const { inviteCode, userId } = req.params;
  if (inviteCode && userId) {
    connection.query(
      `SELECT groupsTable.id,groupsTable.name,groupsTable.avatarGroup, COUNT(membergroup.group_id) AS memberCount 
       FROM groupsTable
       INNER JOIN membergroup ON groupsTable.id = membergroup.group_id
       WHERE groupsTable.invitationCode = ?
       GROUP BY groupsTable.id`,
      [inviteCode],
      function (err, results, fields) {
        if (err) {
          console.log(err);
          return res
            .status(500)
            .json({ error: "Có lỗi xảy ra xin thử lại sau" });
        }
        if (results.length > 0) {
          return res.status(200).json(results[0]);
        } else {
          return res.status(200).json([]);
        }
      }
    );
  } else {
    return res.status(200).json([]);
  }
};
const joinInvitationGroup = (req, res) => {
  const { inviteCode, userId } = req.params;
  if (inviteCode && userId) {
    connection.query(
      `SELECT * FROM groupsTable WHERE invitationCode = ?`,
      [inviteCode],
      function (err, results, fields) {
        if (err) {
          console.log(err);
          return res
            .status(500)
            .json({ error: "Có lỗi xảy ra xin thử lại sau" });
        }
        if (results.length > 0) {
          const groupId = results[0].id;
          connection.query(
            `SELECT * FROM memberGroup WHERE user_id = ?`,
            [userId],
            async function (err, results, fields) {
              if (err) {
                return res.status(500).json({ error: "Lỗi máy chủ" });
              }
              if (results.length > 0) {
                return res.status(200).json({ error: "Đã tham gia vào nhóm" });
              }
              connection.query(
                "INSERT INTO membergroup (group_id,user_id) VALUES (?,?)",
                [groupId, userId],
                async function (err, results, fields) {
                  if (err) {
                    return res.status(500).json({ error: "Lỗi máy chủ" });
                  }
                  return res
                    .status(200)
                    .json({ success: "Vào nhóm thành công" });
                }
              );
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

module.exports = {
  createGroup,
  getDataGroup,
  searchGroup,
  getDataGroupProfile,
  changeAvatarGroup,
  removeAvatarGroup,
  UpdateInformationProfileGroup,
  removeGroup,
  getDataGroupJoined,
  joinGroup,
  TotalMembers,
  outGroup,
  postGroupData,
  CountPostGroup,
  invitationCode,
  getInviteDataGroup,
  joinInvitationGroup,
};
