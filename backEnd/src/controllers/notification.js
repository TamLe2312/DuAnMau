const connection = require("../config/database");

const sendNotifcation = (req, res) => {
  const { postID, recipient_id, userID, title } = req.body;
  connection.query(
    "SELECT * FROM notification WHERE sender_id =? AND post_id =? AND title = ? ",
    [userID, postID, title],
    function (err, results, fields) {
      if (err) {
        return res.status(500).json({ err: "Có lỗi xảy ra xin thử lại sau" });
      }
      if (results) {
        if (results.length > 0) {
          connection.query(
            `UPDATE notification
            SET view = 0, created_ad = NOW()
            WHERE sender_id =? AND post_id =? AND title =? `,
            [parseInt(userID), parseInt(postID), title],
            function (err, results, fields) {
              if (err) {
                console.log(err);
                return res
                  .status(500)
                  .json({ err: "Có lỗi Update xin thử lại sau" });
              }
              if (results) {
                return res
                  .status(200)
                  .json({ success: "Bạn đã gửi thông báo mới" });
              }
            }
          );
        } else {
          connection.query(
            "INSERT INTO notification (post_id,recipient_id,sender_id,title) VALUES (?,?,?,?)",
            [postID, recipient_id, userID, title],
            function (err, results, fields) {
              if (err) {
                console.log(err);
                return res
                  .status(500)
                  .json({ err: "Có lỗi Send xin thử lại sau" });
              }
              if (results) {
                return res
                  .status(200)
                  .json({ success: "Bạn đã gửi thông báo thành công" });
              }
            }
          );
        }
      }
    }
  );
};

const unNotifcation = (req, res) => {
  const { postID, sender_id, title } = req.body;
  connection.query(
    `DELETE FROM notification
    WHERE post_id = ? AND sender_id=? AND title =?
    `,
    [postID, sender_id, title],

    function (err, results, fields) {
      if (err) {
        return res.status(500).json({ err: "Có lỗi xảy ra xin thử lại sau" });
      }
      if (results) {
        return res.status(200).json({ success: "Bạn đã hủy thông báo" });
      }
    }
  );
};

const viewNotifcation = (req, res) => {
  const { notiID } = req.body;
  connection.query(
    `UPDATE notification
    SET view = 1
    WHERE id = ?
    `,
    [notiID],
    function (err, results, fields) {
      if (err) {
        return res.status(500).json({ err: "Có lỗi xảy ra xin thử lại sau" });
      }
      if (results) {
        return res.status(200).json({ success: "Bạn đã đọc thông báo" });
      }
    }
  );
};

const listNotifcation = (req, res) => {
  const myID = parseInt(req.params.myID);
  connection.query(
    `SELECT notification.id as idNotifi ,posts.id as postID, notification.title,notification.view, notification.created_ad as timepost, users.id as userID, users.username, users.name, users.avatar
  FROM notification
  JOIN posts ON notification.post_id = posts.id
  JOIN users ON notification.sender_id = users.id
  WHERE notification.recipient_id = ? AND notification.sender_id <> ? 
  ORDER BY notification.view
  `,
    [myID, myID],

    function (err, results, fields) {
      if (err) {
        console.log(err);
        return res.status(500).json({ err: "Có lỗi xảy ra xin thử lại sau" });
      }
      if (results) {
        return res.status(200).json(results);
      }
    }
  );
};
const notifcation = (req, res) => {
  const myID = parseInt(req.params.myID);
  connection.query(
    `SELECT * FROM notification 
  WHERE recipient_id = ? AND view = 0 AND sender_id <> ?`,
    [myID, myID],

    function (err, results, fields) {
      if (err) {
        console.log(err);
        return res.status(500).json({ err: "Có lỗi xảy ra xin thử lại sau" });
      }
      // return res.status(200).json(results);
      if (results.length === 0) {
        return res.status(200).json({ success: true });
      } else {
        return res.status(200).json({ success: false });
      }
    }
  );
};

module.exports = {
  sendNotifcation,
  listNotifcation,
  unNotifcation,
  viewNotifcation,
  notifcation,
};
