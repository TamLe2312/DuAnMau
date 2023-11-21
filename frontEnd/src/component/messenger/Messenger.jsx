import { useParams, NavLink } from "react-router-dom";
import DetailMess from "./DetailMess";
import "./messenger.css";
import React, { useRef } from "react";
import { useCookies } from "react-cookie";
import { useContext, useEffect, useState } from "react";
// import { io } from "socket.io-client";
import * as request from "../../utils/request";
// import { APP_WEB, HOST_NAME } from "../../utils/config";
// import { userOnline } from "../../page/home/home";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SocketCon } from "../socketio/Socketcontext";
function Messenger() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const value = useContext(SocketCon);
  const socket = value.socket;
  const [online, setonline] = useState([]);
  const [cookies] = useCookies();
  const [listUserMess, setlistUserMess] = useState([]);
  const [chay, setChay] = useState(false);

  const myID = cookies.userId;
  const yourID = useParams().id;
  const fetchListFriendMess = async () => {
    try {
      const res = await request.get(`messenger/recipient/${myID}`);
      if (res) {
        setlistUserMess(res.data);
      }
    } catch (e) {
      console.log(e);
    }
  };
  const handleChay = () => {
    setChay(!chay);
  };
  useEffect(() => {
    const fetchApi = async () => {
      await fetchListFriendMess();
    };
    fetchApi();
  }, [chay]);

  useEffect(() => {
    socket.on("get_ol", (userOl) => {
      setonline(userOl);
    });
  }, [online, socket]);

  const isOnline = (data, yourID) => {
    // if (data.length > 0) {
    const isOl = data.some((user) => user.userId == yourID);
    if (isOl) {
      return (
        <span className="messenger-user-information-mes online">Online</span>
      );
    } else {
      return <span className="messenger-user-information-mes">Offline</span>;
    }
    // } else {
    //   return <span className="messenger-user-information-mes">Offline</span>;
    // }
  };
  const [hien, setHien] = useState(false);
  const [hienUser, setHienUser] = useState(null);
  const handleDel = (e) => {
    // console.log(e.id);
    setHienUser(e.id);
    setHien((pre) => !pre);
  };
  const handleShowdel = () => {
    setShow(true);
  };
  // xóa end
  const handleDelOK = () => {
    const fetchDel = async () => {
      try {
        const res = await request.post(`messenger/delMes`, {
          sender_id: myID,
          recipient_id: hienUser,
        });
        if (res) {
          toast.success("Xóa thành công!");
        }
      } catch (e) {
        console.log(e);
      }
      setShow(false);
      handleChay();
    };
    fetchDel();
  };
  const delRef = useRef();
  useEffect(() => {
    const handleOutMore = (e) => {
      if (delRef.current && !delRef.current.contains(e.target)) {
        setHien(false);
      }
    };
    document.addEventListener("mousedown", handleOutMore);
    return () => {
      document.removeEventListener("mousedown", handleOutMore);
    };
  }, []);

  return (
    <div className="messenger">
      <div className="messenger-users">
        <p className="messenger-users-title">Tin nhắn</p>
        <hr />
        {/* ---------------map------------------- */}
        {listUserMess && listUserMess.length > 0
          ? listUserMess.map((user, index) => {
              return (
                <React.Fragment key={index}>
                  <div className="messenger_child">
                    <NavLink
                      // onClick={() => handleView(user)}
                      to={`/home/messenger/${user.id}`}
                      className="messenger-user"
                      // key={index}
                    >
                      <img
                        src={
                          user.avatar
                            ? user.avatar
                            : "https://i.pinimg.com/564x/81/05/9b/81059b2b505bcf50cdbd09b1ca7d4dae.jpg"
                        }
                        alt=""
                        className="messenger-user-img"
                      />

                      <div className="messenger-user-information">
                        <span className="messenger-user-information-name">
                          {user.name ? user.name : user.username}
                        </span>
                        {isOnline(online, user.id)}
                      </div>
                    </NavLink>

                    <span
                      className="messenger_more"
                      onClick={() => handleDel(user)}
                    >
                      <MoreHorizIcon />
                    </span>
                    <ul className="list-group list_del_mes ">
                      {hien && hienUser == user.id && (
                        <li
                          ref={delRef}
                          className="list-group-item list_del_mes_item"
                          onClick={() => handleShowdel(user)}
                        >
                          Xóa
                        </li>
                      )}
                    </ul>
                  </div>
                  <Modal
                    show={show}
                    onHide={() => setShow(false)}
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                  >
                    <Modal.Header closeButton>
                      {/* <Modal.Title id="contained-modal-title-vcenter"></Modal.Title> */}
                    </Modal.Header>
                    <Modal.Body>
                      <p>Bạn muốn xóa tin nhắn</p>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button onClick={handleClose}>Hủy</Button>
                      <Button variant="danger" onClick={() => handleDelOK()}>
                        Xóa
                      </Button>
                    </Modal.Footer>
                  </Modal>
                </React.Fragment>
              );
            })
          : "Chưa có cuộc trò truyện nào..."}

        {/* ---------------------------------- */}
      </div>
      <div className="messenger-detail">
        <DetailMess
          myID={myID}
          yourID={yourID}
          handleChay={handleChay}
          listUserMess={listUserMess}
          setonline={setonline}
          chay={chay}
        />
      </div>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default Messenger;
