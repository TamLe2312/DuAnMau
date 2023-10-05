import axios from "axios";
import { useEffect, useState } from "react";
import { Avatar } from "@mui/material";

import "./suggestionFriend.css";
function SuggestionFriend() {
  const [listU, setListU] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        let res = await axios.get("http://localhost:8080/account/listUsers/2");
        // console.log(res.data);
        setListU(res.data);
      } catch (error) {
        // Handle the error here
      }
    };
    fetchData();
  }, []);
  // console.log(listU);

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
                {user.avatar ? (
                  <img
                    className="suggestionFriend-user-img"
                    src={user.avatar}
                    alt=""
                  />
                ) : (
                  <Avatar>{user.username.charAt(0)}</Avatar>
                )}
                <div className="suggestionFriend-title">
                  <span className="suggestionFriend-title-name">
                    {user.name || user.username}
                  </span>
                  <span>{user.name || user.username}</span>
                </div>
              </div>
              <span onClick={() => handleAdd(user)}>Add</span>
            </div>
          );
        })}
    </>
  );
}

export default SuggestionFriend;
