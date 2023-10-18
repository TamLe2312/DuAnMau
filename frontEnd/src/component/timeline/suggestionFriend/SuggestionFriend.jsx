import axios from "axios";
import { useEffect, useState } from "react";
import { Avatar } from "@mui/material";
import { useCookies } from "react-cookie";
import "./suggestionFriend.css";
import { Link } from "react-router-dom";
import { toast } from "sonner";
function SuggestionFriend() {
  const [listU, setListU] = useState([]);
  const [cookies] = useCookies(["session"]);
  const idUser = cookies.userId;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/account/suggestFollow/${idUser}&5`
        );
        setListU(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchData();
  }, [idUser]);

  const handleAdd = async (id) => {
    try {
      let res = await axios.post("http://localhost:8080/account/followUser", {
        follower_id: idUser,
        followed_id: id,
      });
      if (res.data.success) {
        toast.success(res.data.success);
        setListU((prevData) =>
          prevData.map((data) => {
            if (data.id === id) {
              return { ...data, isFollow: true };
            } else {
              return data;
            }
          })
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemove = async (id) => {
    try {
      let res = await axios.post("http://localhost:8080/account/unfollowUser", {
        follower_id: idUser,
        followed_id: id,
      });
      if (res.data.success) {
        toast.success(res.data.success);
        setListU((prevData) =>
          prevData.map((data) => {
            if (data.id === id) {
              return { ...data, isFollow: false };
            } else {
              return data;
            }
          })
        );
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      {listU && listU.length > 0 ? (
        listU.map((user, index) => {
          return (
            <div className="suggestionFriend" key={index}>
              <div className="suggestionFriend-user">
                <Link
                  to={`/home/profile/user/${user.id}`}
                  className="suggestionFriend-title-link"
                >
                  {user.avatar ? (
                    <img
                      className="suggestionFriend-user-img"
                      src={user.avatar}
                      alt=""
                    />
                  ) : (
                    <Avatar>{user.username.charAt(0)}</Avatar>
                  )}
                </Link>
                <div className="suggestionFriend-title">
                  <Link
                    to={`/home/profile/user/${user.id}`}
                    className="suggestionFriend-title-link"
                  >
                    <span className="suggestionFriend-title-name">
                      {user.name || user.username}
                    </span>
                  </Link>
                </div>
              </div>
              {user.isFollow ? (
                <span
                  className="suggestionFriend-add-friend"
                  onClick={() => handleRemove(user.id)}
                >
                  Unfollow
                </span>
              ) : (
                <span
                  className="suggestionFriend-add-friend"
                  onClick={() => handleAdd(user.id)}
                >
                  Follow
                </span>
              )}
            </div>
          );
        })
      ) : (
        <div className="suggestionFriend">
          <span>Hiện tại không có gợi ý theo dõi nào</span>
        </div>
      )}
    </>
  );
}

export default SuggestionFriend;
