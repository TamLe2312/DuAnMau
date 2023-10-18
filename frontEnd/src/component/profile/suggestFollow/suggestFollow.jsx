import axios from "axios";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { useCookies } from "react-cookie";

function SuggestFollow() {
  const [cookies] = useCookies(["session"]);
  const [loading, setLoading] = useState(false);
  const [dataSuggestFollow, setDataSuggestFollow] = useState([]);

  const idUser = cookies.userId;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:8080/account/suggestFollow/${idUser}&20`
        );
        setLoading(false);
        setDataSuggestFollow(response.data);
      } catch (error) {
        setLoading(false);
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
        setDataSuggestFollow((prevData) =>
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
        setDataSuggestFollow((prevData) =>
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
      <div className="container">
        <div className="ProfileFollowSuggestContainer">
          <div className="ProfileFollowSuggestForYou">
            <span>Gợi ý cho bạn</span>
          </div>
          <div>
            <div style={{ height: "auto", overflow: "hidden auto" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  paddingBottom: 0,
                  paddingTop: 0,
                  position: "relative",
                }}
              >
                {loading ? (
                  <div className="ProfileFollowRowContent">
                    <span>Loading....</span>
                  </div>
                ) : dataSuggestFollow && dataSuggestFollow.length > 0 ? (
                  dataSuggestFollow.map((data, index) => {
                    return (
                      <div className="ProfileFollowRowContent" key={index}>
                        <div className="ProfileFollowImgContent">
                          {data.avatar ? (
                            <img
                              src={data.avatar}
                              alt={data.name ? data.name : data.username}
                            />
                          ) : (
                            <img src="https://i.pinimg.com/564x/64/b9/dd/64b9dddabbcf4b5fb2b885927b7ede61.jpg" />
                          )}
                        </div>
                        <span>{data.name ? data.name : data.username}</span>
                        {data.isFollow ? (
                          <button onClick={() => handleRemove(data.id)}>
                            Unfollow
                          </button>
                        ) : (
                          <button onClick={() => handleAdd(data.id)}>
                            Follow
                          </button>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="ProfileFollowRowContent">
                    <span>Hiện tại không có gợi ý theo dõi nào</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SuggestFollow;
