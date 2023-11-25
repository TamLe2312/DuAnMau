const connection = require("../config/database");

const callEnd = (req, res) => {
  const { sender_id, recipient_id, time } = req.body;
  if (time < 1) {
    return res.status(400).json({ error: "Bạn chưa gọi hoặc gì đó" });
  } else if (sender_id === recipient_id) {
    return res
      .status(400)
      .json({ error: "Bạn tự gửi tin nhắn cho bản thân??" });
  } else {
    connection.query(
      "INSERT INTO messenger (sender_id, recipient_id,timecall) VALUES (?, ?,?)",
      [sender_id, recipient_id, time],
      function (err, results, fields) {
        if (err) {
          console.log(err);
          return res
            .status(500)
            .json({ error: "Có lỗi xảy ra xin thử lại sau" });
        }
        if (results) {
          return res.status(200).json({ Success: "Cuộc gọi đã kết thúc" });
        }
      }
    );
  }
};

const missedCall = (req, res) => {
  const { sender_id, recipient_id } = req.body;
  if (sender_id === recipient_id) {
    return res
      .status(400)
      .json({ error: "Bạn tự gửi tin nhắn cho bản thân??" });
  } else {
    connection.query(
      "INSERT INTO messenger (sender_id, recipient_id,missedcall) VALUES (?, ?,true)",
      [sender_id, recipient_id],
      function (err, results, fields) {
        if (err) {
          console.log(err);
          return res
            .status(500)
            .json({ error: "Có lỗi xảy ra xin thử lại sau" });
        }
        if (results) {
          return res.status(200).json({ Success: "Đã bỏ lỡ cuộc gọi" });
        }
      }
    );
  }
};

module.exports = {
  callEnd,
  missedCall,
};
