import { useParams, NavLink } from "react-router-dom";
import DetailMess from "./DetailMess";
import "./messenger.css";
import React, { useRef } from "react";
import { useCookies } from "react-cookie";
import { useContext, useEffect, useState } from "react";
import * as request from "../../utils/request";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SocketCon } from "../socketio/Socketcontext";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
function Messenger() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  // const handleShow = () => setShow(true);
  const value = useContext(SocketCon);
  // const socket = value.socket;
  const [online, setonline] = useState([]);
  const [cookies] = useCookies();
  const [listUserMess, setlistUserMess] = useState([]);
  const [chay, setChay] = useState(false);
  const usersop = value.usersop;

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
  const isOnline = (data, yourID) => {
    const isOl = data.some((user) => user.userId == yourID);
    if (isOl) {
      return (
        <span className="messenger-user-information-mes online">Online</span>
      );
    }
  };
  const [hien, setHien] = useState(false);
  const [hienUser, setHienUser] = useState(null);

  const handleDel = (e) => {
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

  const [isread, setisread] = useState([]);
  const [read, setread] = useState(null);
  const handleRead = (user) => {
    setread(true);
    const fetchRead = async () => {
      try {
        const res = await request.post(`messenger/read`, {
          sender_id: user.id,
          recipient_id: myID,
        });
        if (res) {
          // console.log("đã đọc tin nhắn của", user.id);
        }
      } catch (e) {
        console.log(e);
      }
    };
    fetchRead();
  };
  // người nhận là myid
  useEffect(() => {
    if (listUserMess.length > 0) {
      listUserMess.map(async (item) => {
        try {
          const res = await request.get(`messenger/isread/${item.id}/${myID}`);
          if (res) {
            setisread((pre) => [...pre, res.data]);
          }
        } catch (e) {
          console.log(e);
          return false;
        }
      });
    }
    return () => {
      setisread([]);
    };
  }, [listUserMess]);
  const fetchRead = async (id) => {
    try {
      if (isread && isread.length > 0) {
        const hasUnread = isread.some(
          (item) => item.sender === id && item.success === "Chưa đọc"
        );
        return hasUnread;
      }
      return false;
    } catch (error) {
      console.error(error);
      return null;
    }
  };
  const [userReadStatus, setUserReadStatus] = useState({});
  useEffect(() => {
    listUserMess.forEach((user) => {
      fetchRead(user.id)
        .then((result) => {
          // console.log(result);
          setUserReadStatus((prevStatus) => ({
            ...prevStatus,
            [user.id]: result,
          }));
        })
        .catch((error) => {
          console.error(error);
          // Xử lý lỗi nếu có
        });
    });
  }, [listUserMess]);

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
                      onClick={() => handleRead(user)}
                      to={`/home/messenger/${user.id}`}
                      className="messenger-user"
                    >
                      {/* read */}
                      {userReadStatus[user.id] && !read && (
                        <span className="messenger_user_dot"></span>
                      )}
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
                        {isOnline(usersop, user.id)}
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
                  {/* =================================== */}
                  <Modal
                    show={show}
                    onHide={() => setShow(false)}
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                  >
                    <Modal.Header closeButton></Modal.Header>
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
