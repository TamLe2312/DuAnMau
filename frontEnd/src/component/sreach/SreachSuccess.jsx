import axios from "axios";
import { useEffect, useState } from "react";
import ClearIcon from "@mui/icons-material/Clear";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import * as request from "../../utils/request";

function SreachSuccess({ search }) {
  const [users, setUsers] = useState([]);
  const [cookies] = useCookies(["session"]);
  const id = cookies.userId;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await request.get(
          `account/searchUserProfile/${search}&${id}`
        ); // Thay đổi ID tùy theo người dùng muốn lấy dữ liệu
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchData();
  }, [search]);

  return (
    <div>
      <p>Tìm kiếm gần đây</p>
      {users.length !== 0 ? (
        users.map((user, index) => (
          <div key={index} className="SreachSuccess-parent">
            <div className="SreachSuccess">
              <div className="SreachSuccess-title-img">
                <Link to={`/home/profile/user/${user.id}`}>
                  {user.avatar ? (
                    <img
                      className="ProfileAvatarImg"
                      src={user.avatar}
                      alt="Avatar"
                    />
                  ) : (
                    <img
                      className="ProfileAvatarImg"
                      src="https://i.pinimg.com/564x/64/b9/dd/64b9dddabbcf4b5fb2b885927b7ede61.jpg"
                      alt="Avatar"
                    />
                  )}
                </Link>
              </div>
              <div className="SreachSuccess-title">
                <Link to={`/home/profile/user/${user.id}`}>
                  <span className="SreachSuccess-title-name">{user.name}</span>
                </Link>
                <Link to={`/home/profile/user/${user.id}`}>
                  <span className="SreachSuccess-title-name2">
                    {user.username}
                  </span>
                </Link>
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
