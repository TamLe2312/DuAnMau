import "./detailmess.css";
import InputEmoji from "react-input-emoji";
import SendIcon from "@mui/icons-material/Send";
import { useEffect, useRef, useState, useContext } from "react";
import { format } from "timeago.js";
// import { io } from "socket.io-client";
import * as request from "../../utils/request";
// import { HOST_NAME } from "../../utils/config";
import { userOnline } from "../../page/home/home";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import PhoneIcon from "@mui/icons-material/Phone";
import VideocamIcon from "@mui/icons-material/Videocam";
function DetailMess(props) {
  let value = useContext(userOnline);
  const socket = value.socket;
  const scroll = useRef();
  const input = useRef();
  const { myID, yourID, handleChay, listUserMess, setonline } = props;
  const youID = parseInt(yourID);
  // console.log(yourID);
  const [text, setText] = useState("");
  const [user, setuser] = useState([]);
  const [listmess, setListmess] = useState([]);
  const [newMess, setnewMess] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataMessID, setDataMessID] = useState(null);
  // data user
  const FetchDataUser = async (yID) => {
    try {
      const res = await request.get(`account/detail/${yID}`);
      if (res) {
        setuser(res.data[0]);
      }
    } catch (e) {
      console.log(e);
    }
  };

  // data mess
  const fetchListMess = async (me, you) => {
    try {
      const res = await request.get(`messenger/listMes/${me}/${you}`);
      if (res) {
        setListmess(res.data);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const fetchApi = async () => {
      await FetchDataUser(youID);
      if (youID) {
        await fetchListMess(myID, youID);
      }
    };
    fetchApi();
  }, [youID]);
  // --------------------------
  function handleOnEnter() {
    handleSendMess();
  }
  // ------------------------------------------
  const handleSendMess = async () => {
    const textMes = text.trim();
    try {
      setLoading(true);
      const res = await request.post(`messenger/create`, {
        sender_id: myID,
        recipient_id: user.id,
        message: textMes,
      });
      if (res) {
        // handleChay();
        if (listUserMess.length === 0) {
          handleChay();
        } else {
          const addUserLisst = listUserMess?.find((user) => user.id === youID);
          !addUserLisst && handleChay();
        }
        const data = res.data[0];
        await setListmess([...listmess, data]);
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
      console.log(e);
    }
    setText("");
  };

  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
    input.current?.focus();
  }, [listmess]);
  useEffect(() => {
    socket.emit("add_new_user", myID);
    // socket.on("get_user", (userOl) => {
    //   console.log("online", userOl);
    //   setonline(userOl);
    // });
    if (listmess.length > 0) {
      socket.emit("add_message", { mes: listmess, youID, myID });
    }
    socket.on("get_message", (data) => {
      const { mes, myID } = data;
      setDataMessID(myID);
      setnewMess(mes);
    });
  }, [loading, yourID, socket]);

  useEffect(() => {
    if (dataMessID !== null && !isNaN(youID) && dataMessID === youID) {
      setListmess(newMess);
    }
  }, [newMess, yourID]);
  const [imgBlob, setImgBlob] = useState(null);
  const handleImgMessage = (img) => {
    let imgm = URL.createObjectURL(img[0]);
    console.log(imgm);
    setImgBlob(imgm);
  };
  const handleDelImgBlob = () => {
    setImgBlob(null);
    console.log("đã xóa thành công");
  };
  const handleCallVideo = (user) => {
    console.log("call video", user);
  };
  const handleCall = (user) => {
    console.log("call", user);
  };
  return (
    <>
      {yourID ? (
        user ? (
          <>
            <div className="detailMess-user">
              <img
                src={
                  user.avatar
                    ? user.avatar
                    : "https://i.pinimg.com/564x/81/05/9b/81059b2b505bcf50cdbd09b1ca7d4dae.jpg"
                }
                alt=""
                className="messenger-user-img"
              />
              <span className="detailMess-user-name">
                {user.name !== null ? user.name : user.username}
              </span>
              <div className="detailMess_call">
                <span onClick={() => handleCall(user)}>
                  <PhoneIcon sx={{ fontSize: 20 }} />
                </span>
                <span onClick={() => handleCallVideo(user)}>
                  <VideocamIcon />
                </span>
              </div>
            </div>
            <div
              style={{
                backgroundImage:
                  'url("https://i.pinimg.com/564x/a3/4b/0b/a34b0b2d681498d3f8e39c29f91fc936.jpg")',
              }}
              className="detailMess"
            >
              {/* ------------------------------------------ */}

              <div className="detailMessContainer">
                {listmess.length === 0 && (
                  <>
                    <div>Bắt đầu cuộc trò chuyện của bạn</div>
                  </>
                )}
                {listmess.length === 1 ? (
                  <div
                    ref={scroll}
                    className={
                      listmess[0].sender_id === myID
                        ? "detailMessMe"
                        : "detailMessYou"
                    }
                  >
                    <span>{listmess[0].message}</span>
                    {/* <span className="detailMess_imgs">
                      <img
                        className="detailMess_img"
                        src="https://i.pinimg.com/736x/25/36/56/253656e97ca398c9a2f78dcd774a6c7b.jpg"
                        alt=""
                      />
                      <img
                        className="detailMess_img"
                        src="https://i.pinimg.com/736x/25/36/56/253656e97ca398c9a2f78dcd774a6c7b.jpg"
                        alt=""
                      />
                    </span> */}
                    <span className="detailMessContainer-time">
                      {format(listmess[0].created_at)}
                    </span>
                  </div>
                ) : (
                  listmess.map((mes, index) => (
                    <div
                      ref={scroll}
                      className={
                        mes.sender_id === myID
                          ? "detailMessMe"
                          : "detailMessYou"
                      }
                      key={index}
                    >
                      <span>{mes.message}</span>
                      <span className="detailMessContainer-time">
                        {format(mes.created_at)}
                      </span>
                    </div>
                  ))
                )}
              </div>
              {/* ------------------------------------------ */}
            </div>
            {imgBlob && (
              <div className="detailMess_blob_imgs">
                <div className="detailMess_blob_imgs_list">
                  <img className="detailMess_blob_img" src={imgBlob} alt="" />
                  <span
                    className="detailMess_blob_imgs_del"
                    onClick={handleDelImgBlob}
                  >
                    <HighlightOffIcon />
                  </span>
                </div>
                <div className="detailMess_blob_imgs_list">
                  <img
                    className="detailMess_blob_img"
                    src="https://i.pinimg.com/564x/75/d5/fe/75d5fe22bfc2ee37667c98f0b1b4ec06.jpg"
                    alt=""
                  />
                </div>
              </div>
            )}
            {/* ----------------------------------- */}
            <div className="detailMess-imput">
              <div className="detailMess_imgs">
                <input
                  type="file"
                  id="imgs_detail"
                  name="imgMessage"
                  onChange={(e) => handleImgMessage(e.target.files)}
                />
                <label className="imgs_detail_for" htmlFor="imgs_detail">
                  <AddPhotoAlternateIcon />
                </label>
              </div>

              {/* -------------------------------------------- */}
              <InputEmoji
                ref={input}
                value={text}
                onChange={setText}
                cleanOnEnter
                onEnter={handleOnEnter}
                placeholder="Type a message"
              />
              <span
                className={
                  text
                    ? "detailMess-imput-send-success"
                    : "detailMess-imput-send"
                }
                onClick={handleSendMess}
              >
                <SendIcon sx={{ fontSize: 28 }} />
              </span>
            </div>
          </>
        ) : (
          <div className="m-2">Bạn chưa kết nối với người này</div>
        )
      ) : (
        <div className="m-2">hãy bắt đầu trò chuyện với bạn bè</div>
      )}
    </>
  );
}

export default DetailMess;
