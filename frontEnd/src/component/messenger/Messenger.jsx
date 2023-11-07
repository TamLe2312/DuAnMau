import { useParams, NavLink, useNavigate } from "react-router-dom";
import DetailMess from "./DetailMess";
import "./messenger.css";
import { useCookies } from "react-cookie";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import * as request from "../../utils/request";
import { APP_WEB, HOST_NAME } from "../../utils/config";
function Messenger() {
  const socket = useRef();
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

  /*   useEffect(() => {
    const socket = io(HOST_NAME);
    socket.emit("add_new_user", myID);
    socket.on("get_user", (userOl) => {
      setonline(userOl);
    });

    return () => {
      socket.disconnect();
    };
  }, [socket]); */
  const isOnline = (data, yourID) => {
    if (data.length > 0) {
      const isOl = data.find((user) => user.userId === yourID);
      if (isOl) {
        return (
          <span className="messenger-user-information-mes online">Online</span>
        );
      } else {
        return <span className="messenger-user-information-mes">Offline</span>;
      }
    }
  };

  // const [listMesEnd, setlistMessEnd] = useState([]);
  // const handleIsView = (id) => {
  //   return request
  //     .get(`messenger/lastedMess/${myID}/${id}`)
  //     .then((res) => {
  //       if (res.data) {
  //         return res.data[0];
  //       }
  //       return null;
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       return null;
  //     });
  // };

  // const lastMess = async () => {
  //   const lastMessages = await Promise.all(
  //     listUserMess.map((user) => handleIsView(user.id))
  //   );
  //   setlistMessEnd(lastMessages);
  // };

  // useEffect(() => {
  //   if (listUserMess && listUserMess.length > 0) {
  //     lastMess();
  //   }
  //   console.log("NG");
  // }, [listUserMess, yourID]);

  // const findView = (id) => {
  //   const message = listMesEnd?.some(
  //     (mes) => mes.sender_id === id && mes.view === null
  //   );
  //   if (message) {
  //     return (
  //       <span className="messenger-user-information-dot">
  //         <i className="fa-solid fa-circle"></i>
  //       </span>
  //     );
  //   } else {
  //     return null;
  //   }
  // };
  // const [test, setTest] = useState(true);
  // const handleView = (user) => {
  //   try {
  //     const fetchView = async () => {
  //       const res = await request.post(
  //         "messenger/viewMes",
  //         {
  //           sender_id: user.id,
  //           recipient_id: myID,
  //         }
  //       );
  //       if (res) {
  //         handleChay();
  //         setTest(false);
  //       }
  //     };
  //     fetchView();
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  return (
    <div className="messenger">
      <div className="messenger-users">
        <p className="messenger-users-title">Tin nhắn</p>
        <hr />
        {/* ---------------map------------------- */}
        {listUserMess && listUserMess.length > 0
          ? listUserMess.map((user, index) => {
              return (
                <NavLink
                  // onClick={() => handleView(user)}
                  to={`/home/messenger/${user.id}`}
                  className="messenger-user"
                  key={index}
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
                  {/* {test && findView(user.id)} */}
                </NavLink>
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
          // handleLastedMess={handleLastedMess}
        />
      </div>
    </div>
  );
}

export default Messenger;
