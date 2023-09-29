import { useState } from "react";
import ClearIcon from "@mui/icons-material/Clear";

function SreachSuccess({ search }) {
  const [users, setUsers] = useState([
    {
      name: "play soccer",
      img: "https://i.pinimg.com/564x/ba/4c/58/ba4c58b78578bac140ed6ea1886d6b65.jpg",
      title: "gái đẹp nhất",
    },
    {
      name: "gái vip nhất",
      img: "https://i.pinimg.com/736x/68/12/92/68129202dda9dd80d4e3ac4715ba39d8.jpg",
      title: "gái đẹp nhất",
    },
  ]);

  return (
    <div>
      <p>Tìm kiếm gần đây</p>
      {users.length !== 0 ? (
        users.map((user, index) => (
          <div key={index} className="SreachSuccess-parent">
            <div className="SreachSuccess">
              <div className="SreachSuccess-title-img">
                <img src={user.img} alt="" />
              </div>
              <div className="SreachSuccess-title">
                <span className="SreachSuccess-title-name">{user.name}</span>
                <span className="SreachSuccess-title-name2">{user.title}</span>
              </div>
            </div>
            <button>
              <ClearIcon />
            </button>
          </div>
        ))
      ) : (
        <p>Không có nội dung tìm kiếm...</p>
      )}
    </div>
  );
}

export default SreachSuccess;
