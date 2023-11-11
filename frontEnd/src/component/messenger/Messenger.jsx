import { useParams, NavLink } from "react-router-dom";
import DetailMess from "./DetailMess";
import "./messenger.css";
import { useCookies } from "react-cookie";
import { useContext, useEffect, useState } from "react";
// import { io } from "socket.io-client";
import * as request from "../../utils/request";
// import { APP_WEB, HOST_NAME } from "../../utils/config";
import { userOnline } from "../../page/home/home";
function Messenger() {
  const value = useContext(userOnline);
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
  // useEffect(() => {
  //   setonline(value.online);
  // }, [value]);

  useEffect(() => {
    socket.on("get_ol", (userOl) => {
      setonline(userOl);
      console.log(userOl);
    });
  }, [online]);
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
          setonline={setonline}
        />
      </div>
    </div>
  );
}

export default Messenger;
