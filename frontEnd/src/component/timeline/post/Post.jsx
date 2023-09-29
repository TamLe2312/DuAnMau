import { Avatar } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import "./post.css";
import { useState, useRef, useEffect } from "react";

function Post({ user, time, img, like, title }) {
  const [expanded, setExpanded] = useState(false);
  const postFooterRef = useRef(null);
  const [them, setThem] = useState(false);
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

  return (
    <>
      <div className="post">
        <div className="post-header">
          <div className="post-header-aut">
            <Avatar>s</Avatar>
            {user} • <span>{time}</span>
          </div>
          <MoreHorizIcon />
        </div>
        <div className="post-img">
          <img src={img} alt="" />
        </div>
        <div className="post-footer">
          <div className="post-footer-icon">
            <FavoriteBorderIcon />
            <ChatBubbleOutlineIcon />
          </div>
          <b>{like} lượt thích</b>
          <p
            ref={postFooterRef}
            className={`post-title ${expanded ? "expanded" : ""}`}
          >
            <b>{user}</b> {title}
          </p>
          {them ? (
            <button className="post-title-btn" onClick={handleToggleExpand}>
              {expanded ? "Thu gọn" : "Xem thêm"}
            </button>
          ) : (
            ""
          )}
          <a href="">Xem thêm bình luận</a>
        </div>
        <div className="post-footer-input">
          <input type="text" placeholder="Thêm bình luận" />
          <SentimentSatisfiedAltIcon />
          <button>Đăng</button>
        </div>
        <hr />
      </div>
    </>
  );
}

export default Post;
