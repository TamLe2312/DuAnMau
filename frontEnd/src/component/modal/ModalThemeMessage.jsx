import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "./modal.css";
import { useContext, useEffect, useState } from "react";
import * as themeMes from "../../services/messageService";
import { SocketCon } from "../socketio/Socketcontext";
import { useLocation } from "react-router-dom";
const ModalThemeMessage = (props) => {
  const location = useLocation();
  let value = useContext(SocketCon);
  const socket = value.socket;
  const [selectBG, setselectBG] = useState(null);
  const [selectColor, setselectColor] = useState(null);
  const { idtheme, coloryoume, imgbg, onimg, oncolor, onHide, youid, myid } =
    props;
  useEffect(() => {
    setselectBG(imgbg);
    setselectColor(coloryoume);
  }, [props]);

  const bg = [
    "https://i.pinimg.com/564x/36/a8/ad/36a8ad77bdaad6119e4bcac9fea2c9ea.jpg",
    "https://i.pinimg.com/originals/d5/f8/28/d5f828ccc14c86be6789d58b609cd9c3.png",
    "https://external-preview.redd.it/Yg76hmXlw3PYrlL6_PO8y9ATjOH2hmdU17npVJmYF4U.jpg?width=1080&crop=smart&auto=webp&s=c43251304e59c9f52a780f3d19cc4c4d6acee46a",
    "https://i.pinimg.com/originals/7f/53/26/7f532605ea554b59bb8865314dd77479.jpg",
    "https://i.pinimg.com/originals/d4/ae/0e/d4ae0e482c57d557b1063b9dd787a1c0.jpg",
    "https://i.pinimg.com/originals/12/7c/1a/127c1ae027fe838dd660ead4f8b77b6b.jpg",
    "https://i.pinimg.com/originals/69/6e/9d/696e9dfa1a3936bcbbe12ff28144939d.jpg",
    "https://i.pinimg.com/originals/f7/83/e1/f783e1d998c4d539ca1f31c17f8f7525.jpg",
  ];
  const color = [
    { you: "rgba(173, 173, 173, 0.6)", me: "rgba(55, 151, 240, 0.8)" },
    { you: "#CCABDB", me: "#DDE6A5" },
    { you: "#5FCEC7", me: "#C6CD9C" },
    { you: "#FFC98B", me: "#ffb6c1" },
  ];
  const hanldeChangBg = (bg) => {
    setselectBG(bg);
  };
  const hanldeChangColor = (color) => {
    setselectColor(color);
  };
  //   xác nhận
  const [first, setfirst] = useState(false);
  const hanleOKTheme = async () => {
    setfirst(true);
    socket.emit("changetheme", {
      youID: youid,
      myid: myid,
      idtheme: idtheme,
      selectBG: selectBG,
      selectColor: selectColor,
    });
    await themeMes.updateThemeMes(
      idtheme,
      selectBG,
      selectColor.you,
      selectColor.me
    );
    setselectBG(null);
    setselectColor(null);
    onHide();
    if (selectColor) {
      oncolor(selectColor);
    }
    if (selectBG) {
      onimg(selectBG);
    }
  };
  const handleClose = () => {
    setselectBG(null);
    setselectColor(null);
    onHide();
  };
  useEffect(() => {
    socket.on("changetheme", (data) => {
      // console.log(data.myid);
      onimg(data.selectBG);
      oncolor(data.selectColor);
    });
    return () => {
      socket.off("changetheme");
    };
  }, [first]);

  return (
    <div className="modalThemeMessage">
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">Chủ đề</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modalThemeMessage_body">
          Background:
          <div className="modalThemeMessage_theme_bg">
            {bg.map((item, index) => {
              return (
                <img
                  onClick={() => hanldeChangBg(item)}
                  key={index}
                  className={`modalThemeMessage_theme_bg_img ${
                    selectBG == item ? "them" : null
                  }`}
                  src={item}
                  alt={item}
                />
              );
            })}
          </div>
          Color:
          <div className="theme_color_everyone_all">
            {color.map((item, index) => {
              return (
                <div
                  onClick={() => hanldeChangColor(item)}
                  key={index}
                  className={`theme_color_everyone ${
                    selectColor &&
                    selectColor.you == item.you &&
                    selectColor.me == item.me
                      ? "them"
                      : null
                  }`}
                >
                  <div
                    style={{ backgroundColor: item.you }}
                    className="theme_color_everyone_child"
                  ></div>
                  <div
                    style={{ backgroundColor: item.me }}
                    className="theme_color_everyone_child"
                  ></div>
                </div>
              );
            })}
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button className="btn-secondary" onClick={handleClose}>
            Hủy
          </Button>
          <Button
            disabled={selectBG || selectColor ? false : true}
            className="btn-success"
            onClick={hanleOKTheme}
          >
            Xác nhận
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ModalThemeMessage;
