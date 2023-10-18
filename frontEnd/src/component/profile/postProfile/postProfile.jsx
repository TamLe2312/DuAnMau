import axios from "axios";
import { Link } from "react-router-dom";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { useEffect, useState } from "react";

function PostProfile(props) {
  const PostInform = props.data;
  const [Index, setIndex] = useState(2);
  const [imgs, setImgs] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/post/postimg/${PostInform.id}`
        ); // Thay đổi ID tùy theo người dùng muốn lấy dữ liệu
        if (response.data.length > 0) {
          /*         console.log((response.data)); */
          setImgs(response.data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchData();
  }, [PostInform.id]);
  if (imgs && imgs.length > 0 && imgs.length === 1) {
    console.log(imgs);
  }
  const handlePrevImg = () => {
    setIndex(Index - 1);
  };
  const handleNextImg = () => {
    setIndex(Index + 1);
  };

  return (
    <>
      <div className="container ProfilePostHeader">
        <div className="ProfileInformPost">
          <div className="ProfilePostAvatarContent">
            <a href="#" className="ProfilePostAvatarAndNameLink">
              <img
                className="post-avatar"
                src="https://hinhnen4k.com/wp-content/uploads/2023/02/anh-gai-xinh-2k9-1.jpg"
              />
            </a>
            &nbsp;
            <span>{props.data.name}</span>
          </div>
          •<span>0 phút</span>
        </div>
        <div>
          <span className="ProfilePostFeatureButton">
            <MoreHorizIcon />
          </span>
        </div>
      </div>
      <div className="container ProfilePostImg">
        <i className="fa-solid fa-angle-left" onClick={handlePrevImg}></i>
        {imgs && imgs.length > 0 && (
          <img
            src={
              "http://localhost:8080/images/" +
              (imgs.length === 1 ? imgs[0].img : imgs[Index].img)
            }
            alt=""
          />
        )}
        <i className="fa-solid fa-chevron-right" onClick={handleNextImg}></i>
      </div>
      <div className="container ProfilePostFooter">
        <div className="post-footer">
          <div className="post-footer-icon">
            <span className="post-footer-icon-like-comment">
              <FavoriteBorderIcon />
            </span>
            <span className="post-footer-icon-like-comment">
              <ChatBubbleOutlineIcon />
            </span>
          </div>
          <div className="ProfilePostInformationOfPost">
            <b>1 lượt thích</b>
            <p className={`post-title expanded`}>Nothing....</p>
            <span className="post-footer-list-comment">Xem thêm bình luận</span>
          </div>
          <div className="post-footer-user-comment">
            <Link
              to={`/home/profile/user/21`}
              className="post-footer-user-user"
            >
              Michael
            </Link>
            &nbsp;
            <span className="post-footer-comment-comment">Wao</span>
          </div>
        </div>
        <hr />
      </div>
    </>
  );
}

export default PostProfile;
