const multer = require("multer");
const path = require("path");
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

module.exports = {
  createPost,
  upImgs,
  dataPost,
  postimgs,
};
