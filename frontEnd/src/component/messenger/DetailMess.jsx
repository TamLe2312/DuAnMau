import "./detailmess.css";
import InputEmoji from "react-input-emoji";
import SendIcon from "@mui/icons-material/Send";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { format } from "timeago.js";
import { io } from "socket.io-client";
// const socket = io.connect("http://localhost:8080");

function DetailMess(props) {
  const socket = useRef();
  const scroll = useRef();
  const input = useRef();
  const { myID, yourID } = props;
  const youID = parseInt(yourID);

  const [text, setText] = useState("");
  const [user, setuser] = useState([]);
  const [listmess, setListmess] = useState([]);
  const [loading, setLoading] = useState(false);
  const [online, setonline] = useState([]);
  // data user

  const FetchDataUser = async (yID) => {
    try {
      const res = await axios.get(
        `http://localhost:8080/account/detail/${yID}`
      );
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
      const res = await axios.get(
        `http://localhost:8080/messenger/listMes/${me}/${you}`
      );
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
  useEffect(() => {
    socket.current = io("http://localhost:8080");
    socket.current.emit("add_new_user", myID);
    socket.current.on("get_user", (userOl) => {
      console.log(userOl);
    });
  }, [listmess]);
  // ------------------------------------------
  const handleSendMess = async () => {
    const textMes = text.trim();
    try {
      setLoading(true);
      const res = await axios.post(`http://localhost:8080/messenger/create`, {
        sender_id: myID,
        recipient_id: user.id,
        message: textMes,
      });
      if (res) {
        const data = res.data[0];
        setListmess([...listmess, data]);
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
      console.log(e);
    }
    setText("");
  };
  function handleOnEnter() {
    handleSendMess();
  }

  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
    input.current?.focus();
  }, [listmess]);
  // -------------------------------------------
  return (
    <>
      {yourID ? (
        user ? (
          <>
            <div className="detailMess-user">
              <img
                src={
                  user.avatar
                    ? "http://localhost:8080/images/" + user.avatar
                    : "https://i.pinimg.com/564x/81/05/9b/81059b2b505bcf50cdbd09b1ca7d4dae.jpg"
                }
                alt=""
                className="messenger-user-img"
              />
              <span className="detailMess-user-name">
                {user.name !== null ? user.name : user.username}
              </span>
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
            <div className="detailMess-imput">
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
