import { useEffect, useState } from "react";
import "./notification.css";
import { useCookies } from "react-cookie";
import { format } from "timeago.js";
import { Link, useNavigate } from "react-router-dom";
import * as request from "../../utils/request";

function Notification(props) {
  const closeModal = props.closeModal;
  // const setNum = props.setNum;
  const navigate = useNavigate();
  const [cookies] = useCookies();
  const myID = cookies.userId;
  const [notification, setnotification] = useState([]);
  useEffect(() => {
    const fetchNotification = async () => {
      try {
        const res = await request.get(`notification/listNotification/${myID}`);
        if (res) {
          setnotification(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchNotification();
  }, [myID]);
  const handleOffComment = (bao) => {
    // console.log(bao.postID);
    const viewNotification = async () => {
      try {
        const res = await request.post(`notification/viewNotifcation`, {
          notiID: bao.idNotifi,
        });
        if (res) {
          // setNum();
          closeModal(false);
          navigate(`/home/post/${bao.postID}/detail`);
        }
      } catch (error) {
        console.log(error);
      }
    };
    viewNotification();
  };

  return (
    <div className="notification">
      {notification.length > 0 ? (
        notification.map((bao, index) => {
          return (
            <div
              onClick={() => handleOffComment(bao)}
              key={index}
              className={
                bao.view == 0 ? "notification-child doc" : "notification-child"
              }
            >
              <div className="notification-img">
                <img
                  src={
                    bao.avatar === null
                      ? "https://i.pinimg.com/564x/64/b9/dd/64b9dddabbcf4b5fb2b885927b7ede61.jpg"
                      : bao.avatar
                  }
                  alt=""
                />
              </div>
              <div className="notification-title">
                <p>
                  <Link to={`/home/profile/user/${bao.userID}`}>
                    {bao.name === null ? bao.username : bao.name}{" "}
                  </Link>
                  {bao.title}
                </p>
                <span>{format(bao.timepost)}</span>
              </div>
            </div>
          );
        })
      ) : (
        <p>Không có thông báo...</p>
      )}
    </div>
  );
}

export default Notification;
