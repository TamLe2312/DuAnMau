import { Avatar } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import FavoriteIcon from "@mui/icons-material/Favorite";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import axios from "axios";
import "./post.css";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import MyModal from "../../modal/Modal";
import MorePost from "./MorePost";
import { useCookies } from "react-cookie";

// import { Context } from "../../../page/home/home";
// import { useContext } from "react";
function Post({ user, time, avatar, title, name, id, userid }) {
  const [cookies] = useCookies();
  const myID = cookies.userId;
  const [modalShow, setModalShow] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const postFooterRef = useRef(null);
  const [them, setThem] = useState(false);
  const [run, setRun] = useState(0);
  const [img, setImg] = useState([]);
  const [liked, setliked] = useState(false);
  const [like, setlike] = useState(0);
  const [comment, setcomment] = useState("");
  // set times
  const now = new Date();
  const targetDate = new Date(time);
  const milliseconds = now - targetDate;
  const minute = Math.floor(milliseconds / (1000 * 60));
  // const minute = (minutes);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/post/postimg/${id}`
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
  }, [id]);
  // like-------------------------------------
  useEffect(() => {
    try {
      const fetchApi = async () => {
        const res = await axios.post(
          "http://localhost:8080/post/countLikedPost",
          {
            postID: id, // Gửi id trong phần thân của yêu cầu
          }
        );
        if (res.data[0].countlike > 0) {
          setlike(res.data[0].countlike);
        }
      };
      fetchApi();
    } catch (error) {
      console.log(error);
    }
  }, [id]);

  useEffect(() => {
    const postFooterElement = postFooterRef.current;
    if (
      postFooterElement &&
      postFooterElement.scrollWidth > postFooterElement.offsetWidth
    ) {
      setThem(true);
    } else {
      setThem(false);
    }
  }, []);

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
  };

  useEffect(() => {
    try {
      const fetchApi = async () => {
        const res = await axios.get("http://localhost:8080/post/likedPost", {
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
      };
      fetchApi();
    } catch (error) {
      console.log(error);
    }
  }, [id]);

  const handleLikePost = () => {
    setlike((pre) => pre - 1);
    // setlikePost(false);
    setliked(false);
    try {
      const fetchApi = async () => {
        const res = await axios.post("http://localhost:8080/post/UnLikePost", {
          postID: id,
          otherUserID: myID,
        });
        if (res) {
          console.log("bạn đã bỏ thích post: " + id);
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
        const res = await axios.post("http://localhost:8080/post/likePost", {
          postID: id,
          otherUserID: myID,
        });
        if (res) {
          console.log("bạn đã thích post: " + id);
        }
      };
      fetchApi();
    } catch (error) {
      console.log(error);
    }
  };
  // comment------------------------------------
  const hanldleSentComment = (postID) => {
    console.log("post id: " + postID);
    console.log("myID: " + myID);
    console.log(comment);
    setcomment("");
  };
  // -------------------------------------------
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
                <Avatar> {name.charAt(0) || user.charAt(0)}</Avatar>
              )}
              &nbsp;<span>{name || user}</span>
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
            {userid === myID && (
              <MoreHorizIcon onClick={() => handleDELETE(id)} />
            )}
          </span>
        </div>
        <div className="post-img">
          {img && img.length > 0 ? (
            <>
              <img
                src={
                  "http://localhost:8080/images/" +
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
            title
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

            <span className="post-footer-icon-like-comment">
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
          {them ? (
            <button className="post-title-btn" onClick={handleToggleExpand}>
              {expanded ? "Thu gọn" : "Xem thêm"}
            </button>
          ) : (
            ""
          )}
          <a href="" className="post-footer-list-comment">
            Xem thêm bình luận
          </a>
        </div>
        <div className="post-footer-user-comment">
          <Link to="/home" className="post-footer-user-user">
            name
          </Link>
          &nbsp;
          <span className="post-footer-comment-comment">
            bình luận mới nhất
          </span>
        </div>
        <div className="post-footer-input">
          <input
            type="text"
            placeholder="Thêm bình luận"
            value={comment}
            onChange={(e) => setcomment(e.target.value)}
          />
          {/* <SentimentSatisfiedAltIcon /> */}
          <button
            disabled={!comment}
            className={comment && "post-comment"}
            onClick={() => hanldleSentComment(id)}
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
          <MorePost id={id} title={title} show={handleDataFromChild} />
        }
      />
    </>
  );
}

export default Post;
