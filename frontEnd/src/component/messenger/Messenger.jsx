import { useParams, NavLink, useNavigate } from "react-router-dom";
import DetailMess from "./DetailMess";
import "./messenger.css";
import { useCookies } from "react-cookie";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
// import { io } from "socket.io-client";
function Messenger() {
  const [cookies] = useCookies();
  const [listUserMess, setlistUserMess] = useState([]);
  const myID = cookies.userId;
  const yourID = useParams().id;

  const fetchListFriendMess = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/messenger/recipient/${myID}`
      );
      if (res) {
        setlistUserMess(res.data);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const fetchApi = async () => {
      await fetchListFriendMess();
    };
    fetchApi();
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
                <NavLink
                  to={`/home/messenger/${user.id}`}
                  className="messenger-user"
                  key={index}
                >
                  <img
                    src={
                      user.avatar
                        ? "http://localhost:8080/images/" + user.avatar
                        : "https://i.pinimg.com/564x/81/05/9b/81059b2b505bcf50cdbd09b1ca7d4dae.jpg"
                    }
                    alt=""
                    className="messenger-user-img"
                  />

                  <div className="messenger-user-information">
                    <span className="messenger-user-information-name">
                      {user.name ? user.name : user.username}
                    </span>
                    {/* <span className="messenger-user-information-mes">
                      bạn: đã ăn chưa bạn
                    </span> */}
                  </div>
                </NavLink>
              );
            })
          : "Chưa có cuộc trò truyện nào..."}

        {/* ---------------------------------- */}
      </div>
      <div className="messenger-detail">
        <DetailMess myID={myID} yourID={yourID} />
      </div>
    </div>
  );
}

export default Messenger;
