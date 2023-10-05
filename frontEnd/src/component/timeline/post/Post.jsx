import { Avatar } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import "./post.css";
import { useState, useRef, useEffect } from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import axios from "axios";
import { Link } from "react-router-dom";
import MyModal from "../../modal/Modal";
import MorePost from "./MorePost";
// import { Context } from "../../../page/home/home";
// import { useContext } from "react";
function Post({ user, time, like, avatar, title, name, id, userid }) {
  const [modalShow, setModalShow] = useState(false);

  const [expanded, setExpanded] = useState(false);
  const postFooterRef = useRef(null);
  const [them, setThem] = useState(false);
  const [run, setRun] = useState(0);
  const [img, setImg] = useState([]);
  // set time
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
  const handleDELETE = (e) => {
    setModalShow((s) => !s);
  };
  const handleHide = () => {
    setModalShow(false);
  };
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
            <MoreHorizIcon onClick={() => handleDELETE(id)} />
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
            <FavoriteBorderIcon />
            <ChatBubbleOutlineIcon />
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
          <a href="">Xem thêm bình luận</a>
        </div>
        <div className="post-footer-input">
          <input type="text" placeholder="Thêm bình luận" />
          <SentimentSatisfiedAltIcon />
          <button>Đăng</button>
        </div>
        <hr />
      </div>
      <MyModal
        text={""}
        show={modalShow}
        onHide={handleHide}
        childrens={<MorePost id={id} />}
      />
    </>
  );
}

export default Post;
