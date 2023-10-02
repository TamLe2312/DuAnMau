import { useEffect, useState } from "react";
import SuggestionFriend from "./suggestionFriend/SuggestionFriend";
import "./suggestions.css";
import axios from "axios";
import { Avatar } from "@mui/material";
import { useCookies } from "react-cookie";
function Suggestions() {
  const [cookies] = useCookies(["session"]);
  const [userData, setUserData] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const id = cookies.userId;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/account/getDataUser/${id}`); // Thay đổi ID tùy theo người dùng muốn lấy dữ liệu
        setUserData(response.data[0]);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchData();
  }, [id]);
  return (
    <div className="suggestions">
      <div className="suggestions-user">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          userData && userData.avatar ? (
            <img className="suggestionFriend-user-img" src={userData.avatar} alt="" />
          ) : (
            <Avatar>{userData.username.charAt(0)}</Avatar>
          )
        )}
        <div className="suggestions-title">
          {userData.name ? (
            <span className="suggestions-title-name">{userData.name}</span>
          ) :
            (
              <span className="suggestions-title-name">{userData.username}</span>
            )
          }
          {userData.moTa ? (
            <span>{userData.moTa}</span>
          ) :
            (
              <span></span>
            )
          }

        </div>
      </div>

      <div className="suggestions-friend">
        <div className="suggestions-friend-title">
          <p> Gợi ý cho bạn</p>
          <p>All</p>
        </div>
        <SuggestionFriend />
      </div>
    </div>
  );
}

export default Suggestions;
