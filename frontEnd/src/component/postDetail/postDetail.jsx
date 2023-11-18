import { useState, useRef, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import MyModal from "../modal/Modal";
import ListComment from "../timeline/post/ListComment";
import MorePost from "../timeline/post/MorePost";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import FavoriteIcon from "@mui/icons-material/Favorite";
import * as request from "../../utils/request";

function PostDetail() {
  const postId = useParams();
  const [cookies] = useCookies();
  const myID = cookies.userId;
  const focusInput = useRef();
  const [userDataPost, setUserDataPost] = useState([]);
  const [modalShowComment, setModalShowComment] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [img, setImg] = useState([]);
  const [minute, setMinute] = useState(0);
  const [comment, setcomment] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const postFooterRef = useRef(null);
  const [run, setRun] = useState(0);
  const handleDELETE = () => {
    setModalShow((s) => !s);
  };
  const handleHide = () => {
    setModalShow(false);
    // setModalShowComment(false);
  };
  const handlerun = () => {
    setdymanicComment(!dymanicComment);
  };
  /*
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await request.get(
          `post/postimg/${PostInform.id}`
        );
        if (response.data.length > 0) {
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
  */
  const handleDataFromChild = (data) => {
    setModalShow(data);
  };
  const [hasComment, sethasComment] = useState(false);
  const [dymanicComment, setdymanicComment] = useState(true);
  const [commentNew, setcommentew] = useState({
    comment: "",
    user: "",
    userID: "",
  });
  // comment //
  useEffect(() => {
    const fetchApi = async () => {
      try {
        const id = postId.post_id;
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
      } catch (e) {
        console.log(e);
      }
    };
    fetchApi();
  }, [dymanicComment, postId]);
  useEffect(() => {
    const fetchApi = async () => {
      try {
        const id = postId.post_id;
        const res = await request.get(`post/countCommentPost/${id}&0`);
        if (res.data[0].countcomment > 1) {
          sethasComment(true);
        } else {
          sethasComment(false);
        }
      } catch (e) {
        console.log(e);
      }
    };
    fetchApi();
  }, [postId, dymanicComment]);
  const hanldleSentComment = () => {
    try {
      const fetchApi = async () => {
        /*  if (groupPostId) {
          const res = await request.post(
            "post/commentPost",
            {
              groupPostId: groupPostId,
              userID: myID,
              content: comment.trim(),
            }
          );
          if (res.status == 200) {
            setdymanicComment(!dymanicComment);
            console.log("bạn đã bình luận: " + groupPostId);
            setcomment("");
          } else {
            console.log("Có vấn đề gì đó rồi");
          }
        } else {
         
        } */
        const res = await request.post("post/commentPost", {
          postID: postId,
          userID: myID,
          content: comment.trim(),
        });
        if (res.status == 200) {
          setdymanicComment(!dymanicComment);
          console.log("bạn đã bình luận: " + postId);
          setcomment("");
        } else {
          console.log("Có vấn đề gì đó rồi");
        }
      };
      fetchApi();
    } catch (error) {
      console.log(error);
    }
  };
  //comment//

  // Like //
  const [liked, setliked] = useState(false);
  const [like, setlike] = useState(0);
  const handleLikePost = () => {
    setlike((pre) => pre - 1);
    setliked(false);
    try {
      const fetchApi = async () => {
        const res = await request.post("post/UnLikePost", {
          postID: postId,
          otherUserID: myID,
        });
        if (res) {
          console.log("bạn đã bỏ thích post: " + postId);
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
        const res = await request.post("post/likePost", {
          postID: postId.post_id,
          otherUserID: myID,
        });
        if (res) {
          console.log("bạn đã thích post: " + postId.post_id);
        }
      };
      fetchApi();
    } catch (error) {
      console.log(error);
    }
  };
  // Like //

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
  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = postId.post_id;
        const response = await request.get(`post/dataPostAndUser/${id}`);
        const now = new Date();
        const targetDate = new Date(response.data[0].created_at);
        const milliseconds = now - targetDate;
        setMinute(Math.floor(milliseconds / (1000 * 60)));
        setUserDataPost(response.data[0]);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchData();
  }, [postId]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = postId.post_id;
        const response = await request.get(`post/postimg/${id}`);
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
  }, [postId]);
  return (
    <>
      <div className="post">
        <div className="post-header">
          <div className="post-header-aut">
            <Link
              to={`/home/profile/user/${userDataPost.userid}`}
              className="post-header-aut-profile"
            >
              {userDataPost.avatar ? (
                <img className="post-avatar" src={userDataPost.avatar} />
              ) : (
                <img
                  className="post-avatar"
                  src="https://i.pinimg.com/564x/64/b9/dd/64b9dddabbcf4b5fb2b885927b7ede61.jpg"
                  alt="Avatar"
                />
                // <img className="post-avatar" src="" />
              )}
              &nbsp;
              <span>
                {userDataPost.name ? userDataPost.name : userDataPost.username}
              </span>
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
            {userDataPost.userid === myID && (
              <MoreHorizIcon
                onClick={() => {
                  handleDELETE(postId);
                  setModalShowComment(false);
                }}
              />
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
            userDataPost.content
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
            {img && img.length > 0 ? userDataPost.content : ""}
          </p>
          {/* {them ? (
            <button className="post-title-btn" onClick={handleToggleExpand}>
              {expanded ? "Thu gọn" : "Xem thêm"}
            </button>
          ) : (
            ""
          )} */}
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

        {/* <div className="post-footer-input">
          <input
            ref={focusInput}
            type="text"
            placeholder="Thêm bình luận"
            value={comment}
            onChange={(e) => setcomment(e.target.value)}
          />
          <button
            disabled={!comment}
            className={comment && "post-comment"}
            onClick={hanldleSentComment}
          >
            Đăng
          </button>
        </div> */}
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
              id={userDataPost.id}
              groupPostId={null}
              img={img}
              title={userDataPost.content}
              user={userDataPost.username}
              avatar={userDataPost.avatar}
              name={userDataPost.name}
              userid={userDataPost.userid}
              handlerun={handlerun}
            />
          ) : (
            <MorePost
              id={userDataPost.id}
              groupPostId={null}
              title={userDataPost.content}
              show={handleDataFromChild}
            />
          )
        }
      />
    </>
  );
}
export default PostDetail;
