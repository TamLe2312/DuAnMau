import "./detailmess.css";
import InputEmoji from "react-input-emoji";
import SendIcon from "@mui/icons-material/Send";
import { useEffect, useRef, useState, useContext } from "react";
import { format } from "timeago.js";
import * as request from "../../utils/request";
import { HOST_NAME } from "../../utils/config";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import PhoneIcon from "@mui/icons-material/Phone";
import MicNoneIcon from "@mui/icons-material/MicNone";
import Recoder from "../recoder/recoder";
import ClearIcon from "@mui/icons-material/Clear";
import { mirage } from "ldrs";
import Linkify from "linkify-react";
// Default values shown
import { useNavigate } from "react-router-dom";
import { SocketCon } from "../socketio/Socketcontext";
import { dotPulse } from "ldrs";

function DetailMess(props) {
  dotPulse.register();
  const Navigate = useNavigate();
  mirage.register();
  let value = useContext(SocketCon);
  const socket = value.socket;
  const usersss = value.usersop;
  console.log(usersss);
  const scroll = useRef();
  const input = useRef();
  const { myID, yourID, handleChay, listUserMess, chay } = props;
  const youID = parseInt(yourID);
  // console.log(yourID);
  const [text, setText] = useState("");
  const [user, setuser] = useState([]);
  const [listmess, setListmess] = useState([]);
  const [newMess, setnewMess] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataMessID, setDataMessID] = useState(null);
  const [imgBlob, setImgBlob] = useState([]);
  const [imgsMes, setImgsMes] = useState([]);
  const [banghi, setBanghi] = useState(null);
  const [nhan, setNhan] = useState(null);
  const [typing, settyping] = useState(false);

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
  const [listImgMess, setlistImgMess] = useState([]);
  const fetchListImgMess = async (mesID) => {
    try {
      const res = await request.get(`messenger/listImgMess/${mesID}`);
      if (res) {
        if (res.data.length > 0) {
          let a = { mesID, data: res.data };
          return a;
        }
      }
    } catch (e) {
      console.log(e);
    }
  };
  // console.log(listmess);
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
  }, [youID, chay, nhan]);
  // --------------------------
  function handleOnEnter() {
    // setOpenTyping(false);
    handleSendMess();
  }
  // ------------------------------------------
  const handleSendMess = async () => {
    const textMes = text.trim();
    const formData = new FormData();
    try {
      setLoading(true);
      const formDataRecord = new FormData();
      let res = "";
      if (banghi !== null) {
        // console.log(banghi);
        formDataRecord.append(`audio`, banghi);
        formDataRecord.append(`youID`, youID);
        formDataRecord.append(`myID`, myID);
        res = await request.post(`messenger/upRecord`, formDataRecord);
      } else {
        res = await request.post(
          `messenger/create`,
          banghi
            ? {
                sender_id: myID,
                recipient_id: user.id,
                message: textMes,
                listimg: imgsMes,
                recoder: banghi.size,
              }
            : {
                sender_id: myID,
                recipient_id: user.id,
                message: textMes,
                listimg: imgsMes,
              }
        );
      }

      if (res) {
        if (listUserMess.length === 0) {
          handleChay();
        } else {
          const addUserLisst = listUserMess?.find((user) => user.id === youID);
          !addUserLisst && handleChay();
        }
        const data = res.data.results[0];
        // console.log(imgsMes);
        if (imgsMes.length > 0) {
          imgsMes.forEach((img, index) => {
            formData.append(`image${index}`, img);
          });
          formData.append("mesID", res.data.lastID);
          await request.post("messenger/upImgMess", formData);
        }
        // console.log(res.data.lastID);
        await setListmess([...listmess, data]);
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
      console.log(e);
    }
    setText("");
    setImgBlob([]);
    setImgsMes([]);
    setBanghi(null);
    setMic(false);
    setOpenTyping(false);
  };

  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
    input.current?.focus();
  }, [listmess]);
  useEffect(() => {
    if (listmess.length > 0) {
      socket.emit("add_message", { mes: listmess, youID, myID });
    }
    socket.on("get_message", (data) => {
      const { mes, myID } = data;
      setDataMessID(myID);
      setnewMess(mes);
    });
  }, [loading]);
  // socket
  useEffect(() => {
    if (dataMessID !== null && !isNaN(youID) && dataMessID === youID) {
      setListmess(newMess);
    }
  }, [newMess, yourID]);

  // ---------------------------------------------------------------------------
  const handleImgMessage = (e) => {
    setImgBlob([]);
    const newImgs = [];
    const list = [];
    for (let i = 0; i < e.length; i++) {
      list.push(e[i]);
      newImgs.push(URL.createObjectURL(e[i]));
    }
    setImgBlob([...imgBlob, ...newImgs]);
    setImgsMes([...imgsMes, ...list]);
  };
  const handleDelImgBlob = (e) => {
    URL.revokeObjectURL(e);
    const updatedImgBlob = imgBlob.filter((img) => img !== e);
    console.log(imgBlob);
    setImgBlob(updatedImgBlob);
  };

  const [mic, setMic] = useState(false);
  const handleMic = () => {
    setMic((pre) => !pre);
    if (mic) {
      setBanghi(null);
    }
  };
  useEffect(() => {
    let a = [];
    listmess.map((mes) => {
      a.push(fetchListImgMess(mes.id));
    });
    Promise.all(a)
      .then((results) => {
        setlistImgMess(results);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [imgsMes, listmess]);

  const test = (id) => {
    if (listImgMess && listImgMess.length > 0) {
      let a = listImgMess.find((img) => img && img.mesID == id);
      if (a) {
        return a.data.map((img, index) => (
          <img
            key={index}
            className="detailMess_img"
            src={HOST_NAME + "/images/" + img.img}
            alt=""
          />
        ));
      }
    }
  };
  //delBlob
  useEffect(() => {
    setImgBlob([]);
    setMic(false);
    setImgsMes([]);
    setBanghi(null);
    settyping(false);
  }, [youID]);
  // call

  const handleCall = (user) => {
    let id = user.id;
    Navigate(`/home/messenger/${id}/call`, {
      replace: true,
      state: { user },
    });
  };
  useEffect(() => {
    socket.on("calling", (userCall) => {
      setNhan(userCall);
    });
  }, []);

  const traloi = () => {
    setNhan(null);
    setusercall(null);
    let id = user.id;
    Navigate(`/home/messenger/${id}/call`, {
      replace: true,
      state: { user },
    });
  };
  const tuChoi = () => {
    setNhan(null);
    setusercall(null);
  };
  //call time
  const timed = (time) => {
    if (time < 60) {
      return time + " Giây";
    } else if (time < 3601) {
      let minute = Math.floor(time / 60);
      let second = time % 60;
      return time < 60
        ? minute + " Phút "
        : minute + " Phút " + second + " Giây ";
    } else {
      let hour = Math.floor(time / 60);
      let minute = Math.floor(time % 60);
      return hour + " Giờ " + minute + " phút ";
    }
  };
  const [usercall, setusercall] = useState(null);
  useEffect(() => {
    const id = async () => {
      if (nhan) {
        const res = await request.get(`account/detail/${nhan.userId}`);
        if (res) {
          setusercall(res.data[0]);
        }
        let a = setTimeout(() => {
          setNhan(null);
          setusercall(null);
        }, 10000);
        return () => clearTimeout(a);
      }
    };
    id();
  }, [nhan]);

  // typing
  const [openTyping, setOpenTyping] = useState(false);
  const handleText = (e) => {
    setText(e);
    setOpenTyping(e.length > 0);
  };
  useEffect(() => {
    if (openTyping) {
      // console.log("đang nhập");
      socket.emit("typingadd", { youID: youID });
    } else {
      // console.log("Hủy nhập rồi");
      socket.emit("typingstop", { youID: youID });
    }
  }, [openTyping, youID]);
  useEffect(() => {
    socket.on("typingok", () => {
      settyping(true);
    });
    socket.on("typingstop", () => {
      settyping(false);
    });
    return () => {
      socket.off("typingok");
      socket.off("typingstop");
    };
  }, []);
  return (
    <>
      {/* {typing && text.length} */}
      <div className={nhan ? "receiveCall" : "receive_call_end"}>
        {usercall && <span>{usercall.username}</span>} đang gọi
        <div className="receiveCall_btn">
          <button className="btn btn-danger" onClick={tuChoi}>
            Từ chối
          </button>
          &nbsp; &nbsp;
          <button onClick={traloi} className="btn btn-success">
            trả lời
          </button>
        </div>
      </div>
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
                  <PhoneIcon sx={{ fontSize: 22 }} />
                </span>
              </div>
            </div>
            <div
              style={{
                backgroundImage:
                  'url("https://i.pinimg.com/564x/36/a8/ad/36a8ad77bdaad6119e4bcac9fea2c9ea.jpg")',
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
                {listmess.length > 0 &&
                  listmess.map(
                    (mes, index) =>
                      mes.softdelete !== myID && (
                        <div
                          title={format(mes.created_at)}
                          ref={scroll}
                          className={
                            mes.sender_id === myID
                              ? "detailMessMe"
                              : "detailMessYou"
                          }
                          key={index}
                        >
                          {/* list message text*/}
                          <span>
                            <Linkify> {mes.message}</Linkify>
                          </span>
                          {/* list message img*/}
                          <span className="detailMess_imgs">
                            {test(mes.id)}
                          </span>
                          {/* list message recorder*/}
                          <span>
                            {mes.recorder && (
                              <audio
                                className="detailMess_record"
                                src={HOST_NAME + `/audio/` + mes.recorder}
                                controls
                              ></audio>
                            )}
                            {/* list call time*/}
                          </span>
                          {mes.timecall && (
                            <>
                              <span className="detailMess_timecalltitle">
                                Cuộc gọi -&nbsp;
                                <span className="detailMess_timecall">
                                  {timed(mes.timecall)}
                                </span>
                              </span>
                            </>
                          )}
                          {/* list Missed call */}
                          {mes.missedcall && (
                            <span className="detailMess_missedCall">
                              {mes.sender_id == myID
                                ? "Cuộc gọi đi"
                                : "Cuộc gọi nhỡ"}
                            </span>
                          )}

                          {/* ----------------------------------------------- */}
                        </div>
                      )
                  )}
                {/* typing */}
                {/* {typing && ( */}
                {typing && (
                  <span className="detailMess_typing">
                    <l-dot-pulse
                      size="28"
                      speed="1.8"
                      color="gray"
                    ></l-dot-pulse>
                  </span>
                )}
                {/* )} */}
              </div>

              {/* ------------------------------------------ */}
            </div>
            <span>
              {mic && (
                <Recoder youID={youID} myID={myID} setBanghi={setBanghi} />
              )}
            </span>

            {imgBlob && imgBlob.length > 0 && (
              <div className="detailMess_blob_imgs">
                {imgBlob.map((img, index) => (
                  <div key={index} className="detailMess_blob_imgs_list">
                    <img className="detailMess_blob_img" src={img} alt="" />
                    <span
                      className="detailMess_blob_imgs_del"
                      onClick={() => handleDelImgBlob(img)}
                    >
                      <HighlightOffIcon />
                    </span>
                  </div>
                ))}
              </div>
            )}
            {/* ----------------------------------- */}

            <div className="detailMess-imput">
              <div className="detailMess_imgs">
                <input
                  accept="image/jpeg, image/png"
                  multiple
                  type="file"
                  id="imgs_detail"
                  name="imgMessage"
                  onChange={(e) => handleImgMessage(e.target.files)}
                />
                <label className="imgs_detail_for" htmlFor="imgs_detail">
                  <AddPhotoAlternateIcon sx={{ fontSize: 28 }} />
                </label>
              </div>

              {/* -------------------------------------------- */}

              <InputEmoji
                ref={input}
                value={text}
                onChange={handleText}
                cleanOnEnter
                onEnter={handleOnEnter}
                placeholder="Nhập tin nhắn"
              />
              <span className="detailMess_Mic" onClick={handleMic}>
                {!mic ? (
                  <MicNoneIcon sx={{ fontSize: 26 }} />
                ) : (
                  <ClearIcon sx={{ fontSize: 30 }} />
                )}
              </span>
              <span
                className={
                  text || imgBlob.length > 0 || banghi
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
        <div className="m-2">Hãy bắt đầu trò chuyện với ai đó</div>
      )}
    </>
  );
}

export default DetailMess;
