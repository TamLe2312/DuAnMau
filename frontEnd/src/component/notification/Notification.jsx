import { useState } from "react";
import "./notification.css";

function Notification() {
  const [thongBao, setThongBao] = useState([
    {
      name: "kinomi",
      img: "https://i.pinimg.com/564x/cf/bd/73/cfbd73d81e0eca56870d457adb92f667.jpg",
      title: "đã thích hình ảnh của bạn",
      time: 12,
    },
    {
      name: "girl",
      img: "https://i.pinimg.com/564x/90/7b/23/907b236e0b16b593e9802c030f821fce.jpg",
      title: "đã Bình luận hình ảnh của bạn",
      time: 60,
    },
  ]);

  return (
    <div className="notification">
      {thongBao.length !== 0 ? (
        thongBao.map((bao, index) => {
          return (
            <div key={index} className="notification-child doc">
              <div className="notification-img">
                <img src={bao.img} alt="" />
              </div>
              <div className="notification-title">
                <p>
                  <span>{bao.name} </span>
                  {bao.title}
                </p>
                <span>{bao.time} giờ trước</span>
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
