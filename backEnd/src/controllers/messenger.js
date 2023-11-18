const connection = require("../config/database");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./src/public/images");
  },
  filename: (req, file, cb) => {
    // console.log(file);
    const mixName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);
    cb(null, file.fieldname + "_" + mixName);
  },
});
const upload = multer({
  storage: storage,
});

// update audio
const storageaudio = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./src/public/audio");
  },
  filename: (req, file, cb) => {
    const ext = ".mp3";
    const mixName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname) +
      ext;
    cb(null, file.fieldname + "_" + mixName);
  },
});
const uploadaudio = multer({
  storage: storageaudio,
});

// tets = delete img messsage
const test = async (sender_id, recipient_id) => {
  const uploadDir = path.join(__dirname, "../public/images/");
  if (sender_id === recipient_id) {
    return res.status(400).json({ error: "không có tin nhắn với bản thân??" });
  } else {
    const listImg = await new Promise((resolve, reject) => {
      connection.query(
        `     SELECT listdata.img
    FROM listdata
    INNER JOIN messenger ON listdata.mess_id = messenger.id WHERE ((messenger.sender_id = ? AND messenger.recipient_id = ?) OR (messenger.sender_id = ? AND messenger.recipient_id = ?))`,
        [sender_id, recipient_id, recipient_id, sender_id],
        function (err, results, fields) {
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
      console.log("Bài viết không có hình ảnh");
    } else {
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
        console.log("Bạn đã xóa img mess");
      } catch (err) {
        console.log(err);
        console.log("Lỗi xóa hình ảnh");
      }
    }
  }
};

const upImgsMes = (req, res) => {
  const uploadMiddleware = upload.any();
  uploadMiddleware(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.log(err);
      return res.status(500).json({ error: "Có lỗi xảy ra khi tải lên file" });
    } else if (err) {
      console.log(err);
      return res.status(500).json({ error: "Có lỗi xảy ra xin thử lại sau 1" });
    }
    if (req.files) {
      const mesID = req.body.mesID;
      const files = req.files;
      let completed = 0;
      files.forEach((file) => {
        connection.query(
          "INSERT INTO listdata (mess_id,img) VALUES (?,?)",
          [mesID, file.filename],
          function (err, results, fields) {
            completed++;
            if (err) {
              return res
                .status(500)
                .json({ error: "Có lỗi xảy ra xin thử lại sau 2" });
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
    } else {
      return res.status(200).json({ success: "Không nhận được img" });
    }
  });
};

const listMessImg = (req, res) => {
  const mesID = req.params.mesID;
  connection.query(
    "SELECT id as idImgMes, mess_id, img FROM listdata WHERE (mess_id = ? )",
    [mesID],
    function (err, results, fields) {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: "Có lỗi xảy ra xin thử lại sau" });
      }
      return res.status(200).json(results);
    }
  );
};

const delRecord = async (sender_id, recipient_id) => {
  const uploadDir = path.join(__dirname, "../public/audio/");
  if (sender_id === recipient_id) {
    return res.status(400).json({ error: "không có tin nhắn với bản thân??" });
  } else {
    const listAudio = await new Promise((resolve, reject) => {
      connection.query(
        `SELECT recorder FROM messenger WHERE ((messenger.sender_id = ? AND messenger.recipient_id = ?) OR (messenger.sender_id = ? AND messenger.recipient_id = ?)) AND recorder IS NOT NULL`,
        [sender_id, recipient_id, recipient_id, sender_id],
        function (err, results, fields) {
          if (err) {
            reject(err);
          } else {
            const audioPaths = results.map((re) =>
              path.join(uploadDir, re.recorder)
            );
            resolve(audioPaths);
          }
        }
      );
    });
    if (listAudio.length === 0) {
      console.log("Bài viết không có audio");
    } else {
      try {
        await Promise.all(
          listAudio.map((audiodel) => {
            return new Promise((resolve, reject) => {
              fs.unlink(audiodel, (err) => {
                if (err) {
                  reject(err);
                } else {
                  resolve();
                }
              });
            });
          })
        );
        console.log("Bạn đã xóa audio mess");
      } catch (err) {
        console.log(err);
        console.log("Lỗi xóa audio");
      }
    }
  }
};

const upRecordMes = (req, res) => {
  const uploadMiddleware = uploadaudio.any();
  uploadMiddleware(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.log(err);
      return res.status(500).json({ error: "Có lỗi xảy ra khi tải lên file" });
    } else if (err) {
      console.log(err);
      return res.status(500).json({ error: "Có lỗi xảy ra xin thử lại sau 1" });
    }
    if (req.files) {
      const youID = req.body.youID;
      const myID = req.body.myID;
      const files = req.files;
      connection.query(
        "INSERT INTO messenger (sender_id , recipient_id , recorder) VALUES (?,?,?)",
        [myID, youID, files[0].filename],
        function (err, results, fields) {
          if (err) {
            console.log(err);
            return res
              .status(500)
              .json({ error: "Có lỗi xảy ra xin thử lại sau 2" });
          } else {
            if (results) {
              let lastID = results.insertId;
              connection.query(
                `SELECT * FROM messenger WHERE id = ${results.insertId}`,
                function (err, results, fields) {
                  if (err) {
                    console.log(err);
                    return res
                      .status(500)
                      .json({ error: "Có lỗi xảy ra xin thử lại sau" });
                  }
                  if (results) {
                    return res.status(200).json({ results, lastID: lastID });
                  }
                }
              );
            }
          }
        }
      );
    } else {
      return res.status(200).json({ success: "Không nhận được audio" });
    }
  });
};

const messengerSend = (req, res) => {
  const { sender_id, recipient_id, message, listimg, recoder } = req.body;
  // console.log(recoder);
  if (
    (!message || message.trim().length === 0) &&
    listimg.length === 0 &&
    !recoder
  ) {
    return res.status(400).json({ error: "Bạn k có gì để gửi" });
  } else if (sender_id === recipient_id) {
    return res
      .status(400)
      .json({ error: "Bạn tự gửi tin nhắn cho bản thân??" });
  } else {
    // k mes và k hình
    connection.query(
      "INSERT INTO messenger (sender_id, recipient_id,message) VALUES (?, ?,?)",
      [sender_id, recipient_id, message],
      function (err, results, fields) {
        if (err) {
          console.log(err);
          return res
            .status(500)
            .json({ error: "Có lỗi xảy ra xin thử lại sau" });
        }
        if (results) {
          let lastID = results.insertId;
          connection.query(
            `SELECT * FROM messenger WHERE id = ${results.insertId}`,
            function (err, results, fields) {
              if (err) {
                console.log(err);
                return res
                  .status(500)
                  .json({ error: "Có lỗi xảy ra xin thử lại sau" });
              }
              if (results) {
                return res.status(200).json({ results, lastID: lastID });
              }
            }
          );
        }
      }
    );
  }
};

const listMess = (req, res) => {
  const sender_id = parseInt(req.params.sender_id);
  const recipient_id = parseInt(req.params.recipient_id);
  if (sender_id === recipient_id) {
    return res.status(400).json({ error: "không có tin nhắn với bản thân??" });
  } else {
    connection.query(
      //  AND (softdelete IS NULL OR softdelete <> ?)
      "SELECT * FROM messenger WHERE ((sender_id = ? AND recipient_id = ?) OR (sender_id = ? AND recipient_id = ?))",
      [sender_id, recipient_id, recipient_id, sender_id],
      function (err, results, fields) {
        if (err) {
          console.log(err);
          return res
            .status(500)
            .json({ error: "Có lỗi xảy ra xin thử lại sau" });
        }
        return res.status(200).json(results);
      }
    );
  }
};

// view
const viewMess = (req, res) => {
  const { sender_id, recipient_id } = req.body;
  if (sender_id === recipient_id) {
    return res.status(400).json({ error: "không có tin nhắn với bản thân??" });
  } else {
    connection.query(
      `UPDATE messenger
      SET view = 1
      WHERE (sender_id = ? AND recipient_id = ?)`,
      [recipient_id, sender_id],
      function (err, results, fields) {
        if (err) {
          console.log(err);
          return res
            .status(500)
            .json({ error: "Có lỗi xảy ra xin thử lại sau" });
        }
        return res.status(200).json({ success: "Bạn đã đọc tin nhắn" });
      }
    );
  }
};

// recipient;

const recipientList = (req, res) => {
  const sender_id = parseInt(req.params.sender_id);
  connection.query(
    // id,users.avatar,users.name,users.username,messenger.sender_id
    `SELECT DISTINCT users.*
    FROM users  
    JOIN messenger ON (messenger.recipient_id = users.id  OR messenger.sender_id = users.id)
    WHERE (users.id <> ? AND (messenger.sender_id = ? OR messenger.recipient_id = ?)  )`,
    // AND messenger.view is NULL
    [sender_id, sender_id, sender_id],
    function (err, results, fields) {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: "Có lỗi xảy ra xin thử lại sau" });
      }
      if (results) {
        // console.log(results);
        return res.status(200).json(results);
      }
    }
  );
};

const lastedMess = (req, res) => {
  const sender_id = parseInt(req.params.sender_id);
  const recipient_id = parseInt(req.params.recipient_id);
  if (sender_id === recipient_id) {
    return res.status(400).json({ error: "không có tin nhắn với bản thân??" });
  } else {
    connection.query(
      "SELECT * FROM messenger WHERE (sender_id = ? AND recipient_id = ?) OR (sender_id = ? AND recipient_id = ?) ORDER BY id DESC LIMIT 1",
      [sender_id, recipient_id, recipient_id, sender_id],
      function (err, results, fields) {
        if (err) {
          console.log(err);
          return res
            .status(500)
            .json({ error: "Có lỗi xảy ra xin thử lại sau" });
        }
        return res.status(200).json(results);
      }
    );
  }
};

// delete
const delMess = (req, res) => {
  const { sender_id, recipient_id } = req.body;
  connection.query(
    "SELECT DISTINCT  softdelete FROM messenger WHERE (sender_id = ? AND recipient_id = ?) OR (sender_id = ? AND recipient_id = ?)",
    [sender_id, recipient_id, recipient_id, sender_id],
    function (err, results, fields) {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: "Có lỗi xảy ra xin thử lại sau" });
      }
      // return res.status(200).json(results.length);
      if (results.length > 1) {
        // update again
        const del =
          "DELETE FROM  messenger WHERE ((sender_id = ? AND recipient_id = ?) OR (sender_id = ? AND recipient_id = ?)) AND softdelete IS NOT NULL";
        const update =
          "UPDATE messenger SET softdelete = ? WHERE (sender_id = ? AND recipient_id = ?) OR (sender_id = ? AND recipient_id = ?)";
        connection.query(
          del,
          [sender_id, recipient_id, recipient_id, sender_id],
          function (err, results, fields) {
            if (err) {
              console.log(err);
              return res
                .status(500)
                .json({ error: "Có lỗi xảy ra xin thử lại sau" });
            }
            // return res.status(200).json({ success: "Đã xóa tin nhắn " });
            connection.query(
              update,
              [sender_id, sender_id, recipient_id, recipient_id, sender_id],
              function (err, results, fields) {
                if (err) {
                  console.log(err);
                  return res
                    .status(500)
                    .json({ error: "Có lỗi xảy ra xin thử lại sau" });
                }
                return res
                  .status(200)
                  .json({ success: "Đã xóa tin nhắn phía bạn và bên đó " });
              }
            );
          }
        );
      } else {
        if (results && results[0].softdelete === null) {
          // update - soft delete
          connection.query(
            "UPDATE messenger SET softdelete = ? WHERE (sender_id = ? AND recipient_id = ?) OR (sender_id = ? AND recipient_id = ?)",
            [sender_id, sender_id, recipient_id, recipient_id, sender_id],
            function (err, results, fields) {
              if (err) {
                console.log(err);
                return res
                  .status(500)
                  .json({ error: "Có lỗi xảy ra xin thử lại sau" });
              }
              return res
                .status(200)
                .json({ success: "Đã xóa tin nhắn phía bạn" });
            }
          );
        } else {
          //Xóaimg img trong public tại đây
          test(sender_id, recipient_id);
          delRecord(sender_id, recipient_id);
          // delete
          connection.query(
            "DELETE FROM messenger WHERE (sender_id = ? AND recipient_id = ?) OR (sender_id = ? AND recipient_id = ?)",
            [sender_id, recipient_id, recipient_id, sender_id],
            function (err, results, fields) {
              if (err) {
                console.log(err);
                return res
                  .status(500)
                  .json({ error: "Có lỗi xảy ra xin thử lại sau" });
              }
              if (results) {
                return res.status(200).json({ success: "Đã xóa tin nhắn" });
              }
            }
          );
        }
      }
    }
  );
};

module.exports = {
  messengerSend,
  recipientList,
  listMess,
  lastedMess,
  viewMess,
  delMess,
  upImgsMes,
  listMessImg,
  // deletePostImgsMess,
  test,
  upRecordMes,
  // delRecord,
};
