import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import FavoriteIcon from "@mui/icons-material/Favorite";
import * as request from "../../../utils/request";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import "./post.css";
import { useState, useRef, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import MyModal from "../../modal/Modal";
import MorePost from "./MorePost";
import { useCookies } from "react-cookie";
import ListComment from "./ListComment";
import { APP_WEB } from "../../../utils/config";
import { SocketCon } from "../../socketio/Socketcontext";
import * as toxic from "../../vietnamToxic/VietNamToxic";

function Post({ user, time, avatar, title, name, id, userid, groupPostId }) {
  const focusInput = useRef();
  const [cookies] = useCookies();
  const myID = cookies.userId;
  const value = useContext(SocketCon);
  const socket = value.socket;
  const [modalShow, setModalShow] = useState(false);
  const [modalShowComment, setModalShowComment] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const postFooterRef = useRef(null);
  const [run, setRun] = useState(0);
  const [img, setImg] = useState([]);
  const [liked, setliked] = useState(false);
  const [like, setlike] = useState(0);
  const [comment, setcomment] = useState("");

  const now = new Date();
  const targetDate = new Date(time);
  const milliseconds = now - targetDate;
  const minute = Math.floor(milliseconds / (1000 * 60));
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await request.get(
          `post/${groupPostId ? "postGroupImgs" : "postimg"}/${
            groupPostId ? groupPostId : id
          }`
        );
        if (response.status === 200) {
          setImg(response.data);
        } else {
          console.log("Lỗi rồi");
        }
      } catch (error) {
        console.log(error.response.data);
      }
    };
    fetchData();
  }, [id, groupPostId]);

  // like-------------------------------------

  useEffect(() => {
    try {
      const fetchApi = async () => {
        if (groupPostId) {
          const res = await request.post("post/countLikedPost", {
            groupPostId: groupPostId, // Gửi id trong phần thân của yêu cầu
          });
          if (res.data[0].countlike > 0) {
            setlike(res.data[0].countlike);
          } else {
            setlike(0);
          }
        } else {
          const res = await request.post("post/countLikedPost", {
            postID: id, // Gửi id trong phần thân của yêu cầu
          });
          if (res.data[0].countlike > 0) {
            setlike(res.data[0].countlike);
          } else {
            setlike(0);
          }
        }
      };
      fetchApi();
    } catch (error) {
      console.log(error);
    }
  }, [id, groupPostId]);

  const handleToggleExpand = () => {
    setExpanded(!expanded);
  };
  const handleDataFromChild = (data) => {
    setModalShow(data);
  };
  const handleRun = (e) => {
    if (img) {
      const id = e.currentTarget.id;
      const length = img.length;
      if (id === "post-img-left") {
        setRun((pre) => (pre === 0 ? length - 1 : pre - 1));
      } else {
        setRun((pre) => (pre === length - 1 ? 0 : pre + 1));
      }
    }
  };
  const handleDELETE = () => {
    setModalShow((s) => !s);
  };
  const handleHide = () => {
    setModalShow(false);
    // setModalShowComment(false);
  };
  useEffect(() => {
    try {
      const fetchApi = async () => {
        if (groupPostId) {
          const res = await request.get("post/likedPost", {
            params: {
              groupPostId: groupPostId,
              otherUserID: myID,
            },
          });
          if (res.data.success) {
            // console.log(id);
            setliked(true);
          } else {
            setliked(false);
          }
        } else {
          const res = await request.get("post/likedPost", {
            params: {
              postID: id,
              otherUserID: myID,
            },
          });
          if (res.data.success) {
            // console.log(id);
            setliked(true);
          } else {
            setliked(false);
          }
        }
      };
      fetchApi();
    } catch (error) {
      console.log(error);
    }
  }, [id, groupPostId]);

  const notification = async (postID, userID, notifi, recipient_id) => {
    try {
      const res = await request.post(`notification/sendNotification`, {
        postID: postID,
        userID: userID,
        title: notifi,
        recipient_id: recipient_id,
      });
      if (res) {
        console.log("Bạn đã gửi thông báo tới bài viết: " + postID);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const unNotification = async (postID, sender_id, notifi) => {
    try {
      const res = await request.post(`notification/unNotifcation`, {
        postID: postID,
        sender_id: sender_id,
        title: notifi,
      });
      if (res) {
        console.log("Bạn đã hủy thông báo tới bài viết: " + postID);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleLikePost = () => {
    setlike((pre) => pre - 1);
    setliked(false);
    try {
      const fetchApi = async () => {
        if (groupPostId) {
          const res = await request.post("post/UnLikePost", {
            groupPostId: groupPostId,
            otherUserID: myID,
          });
          if (res) {
            console.log("bạn đã bỏ thích Group post: " + groupPostId);
          }
        } else {
          const res = await request.post("post/UnLikePost", {
            postID: id,
            otherUserID: myID,
          });
          if (res) {
            const thongBao = "Đã thích bài viết của bạn";
            await unNotification(id, myID, thongBao);
            // console.log("bạn đã bỏ thích post: " + id);
          }
        }
      };
      fetchApi();
    } catch (error) {
      console.log(error);
    }
  };
  const handleUnLikePost = () => {
    setlike((pre) => pre + 1);
    setliked(true);
    try {
      const fetchApi = async () => {
        if (groupPostId) {
          console.log(groupPostId);
          const res = await request.post("post/likePost", {
            groupPostId: groupPostId,
            otherUserID: myID,
          });
          if (res) {
            // console.log("bạn đã thích Group post: " + groupPostId);
          }
        } else {
          const res = await request.post("post/likePost", {
            postID: id,
            otherUserID: myID,
          });
          if (res) {
            // console.log("bạn đã thích post: " + id);
            let thongBao = "Đã thích bài viết của bạn";
            await notification(id, myID, thongBao, userid);
            // nguời đăng bài
            socket.emit("add_notification", { userid, myID });
          }
        }
      };
      fetchApi();
    } catch (error) {
      console.log(error);
    }
  };
  // comment------------------------------------
  const [dymanicComment, setdymanicComment] = useState(true);
  const [commentNew, setcommentew] = useState({
    comment: "",
    user: "",
    userID: "",
    groupPostId: "",
  });
  const [vipham2, setvipham2] = useState(false);
  const hanldleSentComment = () => {
    const isToxic = toxic.VietNamToxic(comment);
    // console.log(isToxic);
    if (isToxic) {
      setvipham2(true);
    } else {
      try {
        const fetchApi = async () => {
          if (groupPostId) {
            const res = await request.post("post/commentPost", {
              groupPostId: groupPostId,
              userID: myID,
              content: comment.trim(),
            });
            if (res.status == 200) {
              setdymanicComment(!dymanicComment);
              console.log("bạn đã bình luận: " + groupPostId);
              setcomment("");
            } else {
              console.log("Có vấn đề gì đó rồi");
            }
          } else {
            const res = await request.post("post/commentPost", {
              postID: id,
              userID: myID,
              content: comment.trim(),
            });
            if (res.status == 200) {
              let thongBao = "Đã bình luận bài viết của bạn";
              await notification(id, myID, thongBao, userid);
              setdymanicComment(!dymanicComment);
              console.log("bạn đã bình luận: " + id);
              setcomment("");
              socket.emit("add_notification", { userid, myID });
            } else {
              console.log("Có vấn đề gì đó rồi");
            }
          }
        };
        fetchApi();
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    const fetchApi = async () => {
      try {
        if (groupPostId) {
          const res = await request.post("post/onCommentPostLast", {
            groupPostId: groupPostId,
          });
          if (res.data) {
            if (res.data.user_id) {
              const resUser = await request.get(
                `account/getDataUser/${res.data.user_id}`
              );
              setcommentew({
                comment: res.data.content,
                user: resUser.data[0].name || resUser.data[0].username,
                userID: res.data.user_id,
              });
            }
          } else {
            setcommentew({
              comment: "",
              user: "",
              userID: "",
            });
          }
        } else {
          const res = await request.post("post/onCommentPostLast", {
            postID: id,
          });
          if (res.data) {
            if (res.data.user_id) {
              const resUser = await request.get(
                `account/getDataUser/${res.data.user_id}`
              );
              setcommentew({
                comment: res.data.content,
                user: resUser.data[0].name || resUser.data[0].username,
                userID: res.data.user_id,
              });
            }
          } else {
            setcommentew({
              comment: "",
              user: "",
              userID: "",
            });
          }
        }
      } catch (e) {
        console.log(e);
      }
    };
    fetchApi();
  }, [dymanicComment, id, groupPostId]);
  const [hasComment, sethasComment] = useState(false);
  useEffect(() => {
    const fetchApi = async () => {
      try {
        if (groupPostId) {
          const id = groupPostId;
          const res = await request.get(
            `post/countCommentPost/${id}&${groupPostId}`
          );
          if (res.data[0].countcomment > 1) {
            sethasComment(true);
          } else {
            sethasComment(false);
          }
        } else {
          const res = await request.get(`post/countCommentPost/${id}&0`);
          if (res.data[0].countcomment > 1) {
            sethasComment(true);
          } else {
            sethasComment(false);
          }
        }
      } catch (e) {
        console.log(e);
      }
    };
    fetchApi();
  }, [id, groupPostId, dymanicComment]);
  // -------------------------------------------
  const handlerun = () => {
    setdymanicComment(!dymanicComment);
  };
  // console.log(them);
  // -------------------------------------------------------------------------------------------------------
  return (
    <>
      <div className="post" key={id}>
        <div className="post-header">
          <div className="post-header-aut">
            <Link
              to={`/home/profile/user/${userid}`}
              className="post-header-aut-profile"
            >
              {avatar ? (
                <img className="post-avatar" src={avatar} />
              ) : (
                <img
                  className="post-avatar"
                  src="https://i.pinimg.com/564x/64/b9/dd/64b9dddabbcf4b5fb2b885927b7ede61.jpg"
                  alt="Avatar"
                />
                // <img className="post-avatar" src="" />
              )}
              &nbsp;<span>{name ? name : user}</span>
            </Link>
            •
            <span className="post-time">
              {minute < 61
                ? minute + " phút"
                : minute / 60 > 24
                ? Math.floor(minute / 60 / 24) + " Ngày"
                : Math.floor(minute / 60) + " Giờ"}
            </span>
          </div>
          {/* -------------more------------ */}
          <span className="post-more-delete">
            <MoreHorizIcon
              onClick={() => {
                handleDELETE(id);
                setModalShowComment(false);
              }}
            />
          </span>
        </div>
        <div className="post-img">
          {img && img.length > 0 ? (
            <>
              <img
                src={
                  `${APP_WEB}images/` +
                  (img.length === 1 ? img[0].img : img[run].img)
                }
                alt=""
              />
              {img.length > 1 && (
                <>
                  <span
                    id="post-img-left"
                    className="post-img-run"
                    onClick={(e) => handleRun(e)}
                  >
                    <ChevronLeftIcon sx={{ fontSize: 28 }} />
                  </span>
                  <span
                    id="post-img-right"
                    className="post-img-run"
                    onClick={(e) => handleRun(e)}
                  >
                    <ChevronRightIcon sx={{ fontSize: 28 }} />
                  </span>
                  <span className="post-img-count">
                    {run + 1}/{img.length}
                  </span>
                </>
              )}
            </>
          ) : (
            <span style={{ wordBreak: "break-all" }}>{title}</span>
          )}
        </div>
        <div className="post-footer">
          <div className="post-footer-icon">
            {liked ? (
              <span
                className="post-footer-icon-like-comment"
                onClick={handleLikePost}
              >
                <FavoriteIcon />
              </span>
            ) : (
              <span
                className="post-footer-icon-like-comment"
                onClick={handleUnLikePost}
              >
                <FavoriteBorderIcon />
              </span>
            )}

            <span
              className="post-footer-icon-like-comment"
              onClick={() => focusInput.current.focus()}
            >
              <ChatBubbleOutlineIcon />
            </span>
          </div>
          <b>{like} lượt thích</b>
          <p
            ref={postFooterRef}
            className={`post-title ${expanded ? "expanded" : ""}`}
          >
            {img && img.length > 0 ? title : ""}
          </p>
          {hasComment && (
            <span
              className="post-footer-list-comment"
              onClick={() => {
                setModalShow(true);
                setModalShowComment(true);
              }}
            >
              Xem thêm bình luận
            </span>
          )}
        </div>
        {commentNew.comment && commentNew.user && (
          <>
            <div className="post-footer-user-comment">
              <Link
                to={`/home/profile/user/${commentNew.userID}`}
                className="post-footer-user-user"
              >
                {commentNew.user}
              </Link>
              &nbsp;
              <span className="post-footer-comment-comment">
                {commentNew.comment}
              </span>
            </div>
          </>
        )}
        {vipham2 && (
          <span style={{ fontSize: "0.9rem" }} className="text-danger">
            Hãy dùng từ lịch sự
          </span>
        )}
        <div className="post-footer-input">
          <input
            ref={focusInput}
            type="text"
            placeholder="Thêm bình luận"
            value={comment}
            onChange={(e) => {
              setcomment(e.target.value);
              setvipham2(false);
            }}
          />
          {/* <SentimentSatisfiedAltIcon /> */}

          <button
            disabled={!comment}
            className={comment && "post-comment"}
            onClick={hanldleSentComment}
          >
            Đăng
          </button>
        </div>
        <hr />
      </div>
      <MyModal
        text={""}
        show={modalShow}
        onHide={handleHide}
        childrens={
          //  user(tk), time, avatar, title, name, id, userid
          modalShowComment ? (
            <ListComment
              id={id}
              groupPostId={groupPostId}
              img={img}
              title={title}
              user={user}
              avatar={avatar}
              name={name}
              userid={userid}
              handlerun={handlerun}
              //      await notification(id, userid, thongBao, myID);
              notification={notification}
              unNotification={unNotification}
            />
          ) : (
            <MorePost
              userid={userid}
              id={id}
              groupPostId={groupPostId}
              title={title}
              show={handleDataFromChild}
            />
          )
        }
      />
    </>
  );
}

export default Post;
