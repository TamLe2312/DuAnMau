const multer = require("multer");
const path = require("path");
const fs = require("fs");
const connection = require("../config/database");
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

const deletePostImgs = async (req, res) => {
  const uploadDir = path.join(__dirname, "../public/images/");
  const { postID } = req.body;
  const listImg = await new Promise((resolve, reject) => {
    connection.query(
      "SELECT * FROM listdata WHERE post_id = ?",
      [postID],
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
    return res.status(200).json({ success: "Xóa hình ảnh thành công" });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: "Lỗi xóa hình ảnh" });
  }
};

const upImgs = (req, res) => {
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
      // console.log(req.files);
      const postID = req.body.post_id;
      const files = req.files;
      let completed = 0;
      files.forEach((file) => {
        connection.query(
          "INSERT INTO listdata (post_id,img) VALUES (?,?)",
          [postID, file.filename],
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

const createPost = (req, res) => {
  const { userID, content } = req.body;
  if (!userID || !content) {
    return res.status(400).json({ error: "Không bỏ trống thông tin" });
  }
  connection.query(
    "INSERT INTO posts (user_id, content) VALUES (?, ?)",
    [userID, content],
    function (err, results, fields) {
      if (err) {
        return res.status(500).json({ error: "Có lỗi xảy ra xin thử lại sau" });
      }
      if (results) {
        const lastID = results.insertId;
        return res
          .status(200)
          .json({ lastID: lastID, success: "Bạn đã tải bài viết lên" });
      }
    }
  );
};

const deletePost = (req, res) => {
  const { postID } = req.body;
  connection.query(
    "DELETE FROM posts WHERE id = ?",
    [postID],
    function (err, results, fields) {
      if (err) {
        return res.status(500).json({ error: "Có lỗi xảy ra xin thử lại sau" });
      }
      if (results) {
        return res.status(200).json({ error: "Bạn đã xóa bài viết" });
      }
    }
  );
};

const editPost = (req, res) => {
  const { postID, content } = req.body;
  connection.query(
    "UPDATE posts SET content = ? WHERE id = ?",
    [content, postID],
    function (err, results, fields) {
      if (err) {
        return res.status(500).json({ error: "Có lỗi xảy ra xin thử lại sau" });
      }
      if (results) {
        return res.status(200).json({ success: "Bạn đã thay đổi thông tin" });
      }
    }
  );
};

const likePost = (req, res) => {
  const { postID, otherUserID } = req.body;
  connection.query(
    "INSERT INTO likes (post_id,user_id) VALUES (?,?)",
    [postID, otherUserID],
    function (err, results, fields) {
      if (err) {
        return res.status(500).json({ error: "Có lỗi xảy ra xin thử lại sau" });
      }
      if (results) {
        return res.status(200).json({ success: "Bạn đã thích bài viết" });
      }
    }
  );
};

const unLikePost = (req, res) => {
  const { postID, otherUserID } = req.body;
  connection.query(
    "DELETE FROM likes WHERE post_id = ? AND user_id = ?",
    [postID, otherUserID],
    function (err, results, fields) {
      if (err) {
        return res.status(500).json({ error: "Có lỗi xảy ra xin thử lại sau" });
      }
      if (results) {
        return res.status(200).json({ success: "Bạn đã bỏ thích bài viết" });
      }
    }
  );
};

const likedPost = (req, res) => {
  // const { postID, otherUserID } = req.body;
  const { postID, otherUserID } = req.query;
  connection.query(
    "SELECT * FROM likes WHERE post_id =? AND user_id=?",
    [postID, otherUserID],
    function (err, results, fields) {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: "Có lỗi xảy ra xin thử lại sau" });
      }
      if (results.length > 0) {
        return res.status(200).json({ success: "Bạn đã thích bài viết này" });
      } else {
        return res.status(200).json(results);
      }
    }
  );
};

const CountLikedPost = (req, res) => {
  // const { postID, otherUserID } = req.body;
  // const { postID } = req.body;
  const { postID } = req.body;
  //
  connection.query(
    "SELECT COUNT(post_id) as countlike FROM likes WHERE post_id =?",
    [postID],
    function (err, results, fields) {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: "Có lỗi xảy ra xin thử lại sau" });
      }
      if (results.length > 0) {
        return res.status(200).json(results);
      } else {
        return res.status(200).json({ error: "Không có lượt thích" });
      }
    }
  );
};

const dataPost = (req, res) => {
  const page = parseInt(req.params.page) || 1;
  const limit = 4; // Số lượng người dùng hiển thị trên mỗi trang
  const offset = (page - 1) * limit; // Vị trí bắt đầu lấy dữ liệu
  connection.query(
    `SELECT posts.id,posts.content,posts.created_at,users.id as userid, users.username,users.avatar,users.name
    FROM posts  
    JOIN users ON posts.user_id = users.id
    ORDER BY posts.id DESC
    LIMIT ? OFFSET ?
    `,
    [limit, offset],
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

const postimgs = (req, res) => {
  const postID = parseInt(req.params.postID);
  connection.query(
    `SELECT img
    FROM listdata  
   WHERE post_id = ? `,
    [postID], // Use the postID variable here
    function (err, results, fields) {
      if (err) {
        // console.log(err);
        return res.status(500).json({ error: "Có lỗi xảy ra xin thử lại sau" });
      }
      if (results.length > 0) {
        return res.status(200).json(results);
      } else {
        // return res.status(400).json({ success: "Không có bài post nào img" });
        return res.status(200).json(results);
      }
    }
  );
};

// comment
const commentPost = (req, res) => {
  const { postID, userID, content } = req.body;
  connection.query(
    "INSERT INTO comments (post_id,user_id,content) VALUE (?,?,?)",
    [postID, userID, content],
    function (err, results, fields) {
      if (err) {
        return res.status(500).json({ error: "Có lỗi xảy ra xin thử lại sau" });
      }
      if (results) {
        // console.log(results);
        return res.status(200).json({ success: "Bạn đã comment thành công" });
      }
    }
  );
};
const onCommentPostLast = (req, res) => {
  const { postID } = req.body;
  connection.query(
    "SELECT * FROM comments WHERE post_id = ? ORDER BY id DESC LIMIT 1",
    [postID],
    function (err, results, fields) {
      if (err) {
        return res.status(500).json({ error: "Có lỗi xảy ra xin thử lại sau" });
      }
      if (results.length > 0) {
        return res.status(200).json(results[0]);
      } else {
        return res.status(200).json(results[0]);
      }
    }
  );
};

const listCommentPost = (req, res) => {
  // const { postID } = req.body;
  const postID = parseInt(req.params.postID);
  connection.query(
    "SELECT * FROM comments WHERE post_id = ? ",
    [postID],
    function (err, results, fields) {
      if (err) {
        return res.status(500).json({ error: "Có lỗi xảy ra xin thử lại sau" });
      }
      if (results.length > 0) {
        return res.status(200).json(results);
      } else {
        return res
          .status(200)
          .json({ success: "không tồn tại bài viết hoặc comment" });
      }
    }
  );
};

const oneCommentPost = (req, res) => {
  const commentID = parseInt(req.params.commentID);
  connection.query(
    "SELECT * FROM comments WHERE id = ? ",
    [commentID],
    function (err, results, fields) {
      if (err) {
        return res.status(500).json({ error: "Có lỗi xảy ra xin thử lại sau" });
      }
      if (results.length > 0) {
        return res.status(200).json(results);
      } else {
        return res
          .status(200)
          .json({ success: "không tồn tại bài viết hoặc comment" });
      }
    }
  );
};

const deleteCommentPost = (req, res) => {
  const { commentID } = req.body;
  connection.query(
    "DELETE FROM comments WHERE id = ? ",
    [commentID],
    function (err, results, fields) {
      if (err) {
        return res.status(500).json({ error: "Có lỗi xảy ra xin thử lại sau" });
      }
      if (results.affectedRows > 0) {
        // console.log(results);
        // return res.status(200).json();
        return res.status(200).json({ success: "bạn đã xóa comment" });
      } else {
        return res.status(200).json({ success: "comment không tồn tại" });
      }
    }
  );
};

const editCommentPost = (req, res) => {
  const { commentID, userID, content } = req.body;
  connection.query(
    "UPDATE comments SET content = ? WHERE id = ? AND user_id =? ",
    [content, commentID, userID],
    function (err, results, fields) {
      if (err) {
        return res.status(500).json({ error: "Có lỗi xảy ra xin thử lại sau" });
      }
      if (results.affectedRows > 0) {
        // console.log(results);
        // return res.status(200).json();
        return res.status(200).json({ success: "bạn đã sửa comment" });
      } else {
        return res
          .status(200)
          .json({ success: "Bạn không phải người bình luận" });
      }
    }
  );
};
const countCommentPost = (req, res) => {
  // const { commentID } = req.body;
  const postID = parseInt(req.params.postID);
  connection.query(
    "SELECT COUNT(*) as countcomment FROM comments WHERE post_id = ? ",
    [postID],
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

module.exports = {
  createPost,
  upImgs,
  dataPost,
  postimgs,
  deletePost,
  deletePostImgs,
  editPost,
  likePost,
  unLikePost,
  likedPost,
  CountLikedPost,
  commentPost,
  onCommentPostLast,
  listCommentPost,
  deleteCommentPost,
  editCommentPost,
  countCommentPost,
  oneCommentPost,
};
