const connection = require("../config/database");

const messengerSend = (req, res) => {
  const { sender_id, recipient_id, message } = req.body;
  if (!message || message.trim().length === 0) {
    return res.status(400).json({ error: "Bạn k có gì để gửi" });
  } else if (sender_id === recipient_id) {
    return res
      .status(400)
      .json({ error: "Bạn tự gửi tin nhắn cho bản thân??" });
  } else {
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
                return res.status(200).json(results);
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
      "SELECT * FROM messenger WHERE (sender_id = ? AND recipient_id = ?) OR (sender_id = ? AND recipient_id = ?)",
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
module.exports = {
  messengerSend,
  recipientList,
  listMess,
  lastedMess,
  viewMess,
};
