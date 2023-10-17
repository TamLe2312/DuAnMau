import axios from "axios";
import { useEffect, useState } from "react";
import { Avatar } from "@mui/material";
import "./suggestionFriend.css";
import { Link } from "react-router-dom";
function SuggestionFriend() {
  const [listU, setListU] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        let res = await axios.get("http://localhost:8080/account/listUsers/1");
        // console.log(res.data);
        setListU(res.data);
      } catch (error) {
        // Handle the error here
      }
    };
    fetchData();
  }, []);

  const handleAdd = (e) => {
    console.log(e);
  };
  return (
    <>
      {listU &&
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
                  <span>
                    <span>{user.moTa || user.name || user.username}</span>
                  </span>
                </div>
              </div>
              <span
                onClick={() => handleAdd(user)}
                className="suggestionFriend-add-friend"
              >
                Follow
              </span>
            </div>
          );
        })}
    </>
  );
}

export default SuggestionFriend;
