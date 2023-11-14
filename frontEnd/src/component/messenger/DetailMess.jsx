import "./detailmess.css";
import InputEmoji from "react-input-emoji";
import SendIcon from "@mui/icons-material/Send";
import { useEffect, useRef, useState, useContext } from "react";
import { format } from "timeago.js";
// import { io } from "socket.io-client";
import * as request from "../../utils/request";
import { HOST_NAME } from "../../utils/config";
import { userOnline } from "../../page/home/home";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import PhoneIcon from "@mui/icons-material/Phone";
import VideocamIcon from "@mui/icons-material/Videocam";
import MicNoneIcon from "@mui/icons-material/MicNone";
function DetailMess(props) {
  let value = useContext(userOnline);
  const socket = value.socket;
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
        // res.data.map((id) => {
        //   fetchListImgMess(id.id);
        // });
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
  }, [youID, chay]);
  // --------------------------
  function handleOnEnter() {
    handleSendMess();
  }
  // ------------------------------------------
  const handleSendMess = async () => {
    const textMes = text.trim();
    const formData = new FormData();
    try {
      setLoading(true);
      const res = await request.post(`messenger/create`, {
        sender_id: myID,
        recipient_id: user.id,
        message: textMes,
        listimg: imgsMes,
      });
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
  }, [loading, socket]);

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
  const handleCallVideo = (user) => {
    console.log("call video", user);
  };
  const handleCall = (user) => {
    console.log("call", user);
  };
  const handleMic = () => {
    // console.log(typeof youID);
    // console.log(youID);
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

  // useEffect(() => {
  //   if (listImgMess.length > 0) {
  //     let a = listImgMess.find((img) => img && img.mesID == 171);
  //     if (a) {
  //       console.log(a.data);
  //     }
  //   }
  // }, [listImgMess]);
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
                  <PhoneIcon sx={{ fontSize: 22 }} />
                </span>
                <span onClick={() => handleCallVideo(user)}>
                  <VideocamIcon sx={{ fontSize: 28 }} />
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
                          ref={scroll}
                          className={
                            mes.sender_id === myID
                              ? "detailMessMe"
                              : "detailMessYou"
                          }
                          key={index}
                        >
                          <span>{mes.message}</span>
                          {/* <span>{mes.id}</span> */}
                          <span className="detailMess_imgs">
                            {test(mes.id)}
                            {/* <img
                              className="detailMess_img"
                              src="https://i.pinimg.com/736x/25/36/56/253656e97ca398c9a2f78dcd774a6c7b.jpg"
                              alt=""
                            />
                            <img
                              className="detailMess_img"
                              src="https://i.pinimg.com/736x/25/36/56/253656e97ca398c9a2f78dcd774a6c7b.jpg"
                              alt=""
                            /> */}
                          </span>
                          <span className="detailMessContainer-time">
                            {format(mes.created_at)}
                          </span>
                        </div>
                      )
                  )}
              </div>

              {/* ------------------------------------------ */}
            </div>
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
                onChange={setText}
                cleanOnEnter
                onEnter={handleOnEnter}
                placeholder="Type a message"
              />
              <span className="detailMess_Mic" onClick={handleMic}>
                <MicNoneIcon sx={{ fontSize: 26 }} />
              </span>
              <span
                className={
                  text || imgBlob.length > 0
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
