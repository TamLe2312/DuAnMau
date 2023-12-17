const connection = require("../config/database");

const creatThemeMessage = (req, res) => {
  const { userone, usertwo } = req.body;
  const theme =
    "https://i.pinimg.com/564x/36/a8/ad/36a8ad77bdaad6119e4bcac9fea2c9ea.jpg";
  const colorreceiver = "rgba(173, 173, 173, 0.6)";
  const colorsender = "rgba(55, 151, 240, 0.8)";
  connection.query(
    "SELECT * FROM thememessage WHERE (userone =? AND usertwo =?) OR (userone =? AND usertwo =?)",
    [userone, usertwo, usertwo, userone],
    function (err, results, fields) {
      if (err) {
        console.log(err);
        return res.status(500).json({ err: "Có lỗi xảy ra xin thử lại sau" });
      }
      if (results.length === 0) {
        connection.query(
          `INSERT INTO thememessage (userone, usertwo, theme, colorreceiver, colorsender)
           VALUES (?, ?, ?,?,?)`,
          [userone, usertwo, theme, colorreceiver, colorsender],
          function (err, results, fields) {
            if (err) {
              return res
                .status(500)
                .json({ err: "Có lỗi xảy ra xin thử lại sau" });
            }
            return res.status(200).json({ success: "Tạo theme thành công" });
          }
        );
      } else {
        return res.status(200).json({ success: "tồn tại dữ liệu rồi" });
      }
    }
  );
};

const thememessage = (req, res) => {
  //   const { userone, usertwo, theme, colorreceiver, colorsender } = req.params;
  const { idone, idtwo } = req.params;
  connection.query(
    "SELECT * FROM thememessage WHERE (userone =? AND usertwo =?) OR (userone =? AND usertwo =?)",
    [idone, idtwo, idtwo, idone],
    function (err, results, fields) {
      if (err) {
        return res.status(500).json({ err: "Có lỗi xảy ra xin thử lại sau" });
      }
      return res.status(200).json(results);
    }
  );
};

const updateThemeMessage = (req, res) => {
  const { idtheme, theme, colorreceiver, colorsender } = req.body;
  connection.query(
    `  UPDATE thememessage
       SET theme =?, colorreceiver =?, colorsender =?
       WHERE id =?`,
    [theme, colorreceiver, colorsender, idtheme],
    function (err, results, fields) {
      if (err) {
        console.log(err);
        return res.status(500).json({ err: "Có lỗi xảy ra xin thử lại sau" });
      }
      if (results.length === 0) {
        connection.query(
          `INSERT INTO thememessage (userone, usertwo, theme, colorreceiver, colorsender)
           VALUES (?, ?, ?,?,?)`,
          [userone, usertwo, theme, colorreceiver, colorsender],
          function (err, results, fields) {
            if (err) {
              return res
                .status(500)
                .json({ err: "Có lỗi xảy ra xin thử lại sau" });
            }
            return res.status(200).json({ success: "Tạo theme thành công" });
          }
        );
      } else {
        return res.status(200).json({ success: "tồn tại dữ liệu rồi" });
      }
    }
  );
};

module.exports = {
  thememessage,
  creatThemeMessage,
  updateThemeMessage,
};
