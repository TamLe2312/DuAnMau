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
            SET view = 0
            WHERE  WHERE sender_id =? AND post_id =? AND title =? `,
            [userID, postID, title],
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
    WHERE post_id
    `,
    [postID, sender_id, title],

    function (err, results, fields) {
      if (err) {
        return res.status(500).json({ err: "Có lỗi xảy ra xin thử lại sau" });
      }
      if (results) {
        return res
          .status(200)
          .json({ success: "Bạn đã gửi thông báo thành công" });
      }
    }
  );
};

const listNotifcation = (req, res) => {
  const myID = parseInt(req.params.myID);

  connection.query(
    `SELECT posts.id as postID, notification.title,notification.view, notification.created_ad as timepost, users.id as userID, users.username, users.name, users.avatar
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

module.exports = {
  sendNotifcation,
  listNotifcation,
  unNotifcation,
};
