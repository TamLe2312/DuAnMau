import { useEffect, useState, useContext } from "react";
import "./comments.css";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { useCookies } from "react-cookie";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Avatar } from "@mui/material";
import * as request from "../../../utils/request";
import { SocketCon } from "../../socketio/Socketcontext";
import * as toxic from "../../vietnamToxic/VietNamToxic";
function Comments(props) {
  let value = useContext(SocketCon);
  const socket = value.socket;
  const handleRun = props.handlerun;
  const [cookies] = useCookies();
  const myID = cookies.userId;
  const {
    img,
    title,
    avatar,
    user,
    userid,
    name,
    id,
    groupPostId,
    notification,
    unNotification,
  } = props;
  const [listComment, setListComment] = useState([]);
  const [userComment, setUserComment] = useState([]);
  const [content, setcontent] = useState("");
  const [doi, setdoi] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [show, setShow] = useState(false);
  const [commentedit, setcommentedit] = useState("");
  const [contentEdit, setcontentEdit] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        if (groupPostId) {
          const response = await request.get(
            `post/listCommentPost/${id}&${groupPostId}`
          );
          console.log(response.data);
          if (response.data.length > 0) {
            setListComment(response.data);

            const userIds = response.data.map((comment) => comment.user_id);
            const uniqueUserIds = Array.from(new Set(userIds));
            await fetchUserDetails(uniqueUserIds);
          } else {
            setListComment([]);
            setUserComment([]);
          }
        } else {
          const response = await request.get(`post/listCommentPost/${id}&0`);
          if (response.data.length > 0) {
            setListComment(response.data);
            const userIds = response.data.map((comment) => comment.user_id);
            const uniqueUserIds = Array.from(new Set(userIds));
            await fetchUserDetails(uniqueUserIds);
          } else {
            setListComment([]);
            setUserComment([]);
          }
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    const fetchUserDetails = async (userIds) => {
      try {
        const requests = userIds.map(async (userId) => {
          const response = await request.get(`account/getDataUser/${userId}`);
          return response.data[0];
        });
        const userDetails = await Promise.all(requests);
        setUserComment(userDetails);
      } catch (error) {
        console.error("có lỗi xảy ra xin thử lại sau:", error);
      }
    };

    fetchComments();
  }, [id, doi]);
  const [viPhamComment, setviPhamComment] = useState(false);
  const handleSend = () => {
    // console.log(content);
    const isToxic = toxic.VietNamToxic(content);
    console.log(isToxic);
    if (isToxic) {
      setviPhamComment(true);
    } else {
      try {
        const fetchApi = async () => {
          if (groupPostId) {
            const res = await request.post("post/commentPost", {
              content: content,
              userID: myID,
              groupPostId: groupPostId,
            });
            if (res) {
              setcontent("");
              setdoi((e) => !e);
              handleRun();
            }
          } else {
            const res = await request.post("post/commentPost", {
              content: content,
              userID: myID,
              postID: id,
            });
            if (res) {
              // console.log(userid);
              let thongBao = "Đã bình luận bài viết của bạn";
              await notification(id, myID, thongBao, userid);
              socket.emit("add_notification", { userid, myID });
              setcontent("");
              setdoi((e) => !e);
              handleRun();
            }
          }
        };
        fetchApi();
      } catch (e) {
        console.log(e);
      }
    }
  };
  const [cmtID, setcmtID] = useState("");
  const commentMore = (commentID) => {
    setcmtID(commentID);
    setModalShow(true);
    try {
      const fetchApi = async () => {
        const res = await request.get(`post/oneCommentPost/${commentID}`);
        if (res.data) {
          // console.log(res.data[0].content);
          setcontentEdit(res.data[0].content);
        }
      };
      fetchApi();
    } catch (e) {
      console.log(e);
    }
  };
  const handleSHow = (e) => {
    setcommentedit(e.target.id);
    setModalShow(false);
    setShow(true);
  };
  const handleClose = () => {
    setShow(false);
    setcmtID("");
  };
  const handleSuccess = () => {
    if (commentedit === "comment-del") {
      // console.log("Xóa: " + cmtID);
      try {
        const fetchApi = async () => {
          const res = await request.post(`post/deleteCommentPost`, {
            commentID: cmtID,
          });
          if (res.data) {
            const thongBao = "Đã bình luận bài viết của bạn";
            await unNotification(id, myID, thongBao);
            setdoi((e) => !e);
            handleRun();
            // toast.success("Bạn đã xóa bình luận");
          }
        };
        fetchApi();
      } catch (e) {
        console.log(e);
      }
    } else {
      try {
        const fetchApi = async () => {
          const res = await request.post(`post/editCommentPost`, {
            content: contentEdit,
            commentID: cmtID,
            userID: myID,
          });
          if (res.data) {
            setdoi((e) => !e);
            handleRun();
            // toast.success("Bạn đã sửa bình luận");
          }
        };
        fetchApi();
      } catch (e) {
        console.log(e);
      }
    }
    setShow(false);
  };

  return (
    <>
      {/* <Toaster richColors /> */}
      {img.length > 0 && (
        <div className="commentschild-admin">
          {avatar ? (
            <img className="post-avatar" src={avatar} alt="" />
          ) : (
            <img
              className="post-avatar"
              src="https://i.pinimg.com/564x/13/59/5c/13595cf982c1fa5bd1d16b4627f8ce56.jpg"
              alt=""
            />
          )}
          <span>
            <span className="commentschild-usercomment">{name || user}</span>
            &nbsp; {title}
          </span>
        </div>
      )}
      <div
        className={img.length > 0 ? "commentschild" : "commentschild-notimg"}
      >
        {/* {console.log(userComment)} */}
        {listComment.length > 0
          ? listComment.map((comment, index) => {
              const user = userComment.find(
                (user) => user.id === comment.user_id
              );
              // const username = user ? user.username : null;

              return (
                <div className="commentschild-once" key={index}>
                  <img
                    src="https://i.pinimg.com/564x/64/b9/dd/64b9dddabbcf4b5fb2b885927b7ede61.jpg"
                    alt=""
                  />
                  <span>
                    <span className="commentschild-usercomment">
                      {user && (user.name ?? user.username)}
                    </span>
                    &nbsp; {comment.content}
                  </span>
                  {myID === comment.user_id && (
                    <span
                      className="commentschild-usermore"
                      onClick={() => commentMore(comment.id)}
                    >
                      <MoreHorizIcon />
                    </span>
                  )}
                </div>
              );
            })
          : "Không có ai bình luận"}
      </div>
      <div className="commentschild-input">
        <div className="input-group">
          <input
            value={content}
            type="text"
            className="form-control"
            placeholder="Viết bình luận"
            onChange={(e) => {
              setcontent(e.target.value);
              setviPhamComment(false);
            }}
          />

          <button
            disabled={!content}
            className={
              content
                ? "input-group-text commentschild-inputgroup-btn"
                : "input-group-text"
            }
            onClick={handleSend}
          >
            Đăng
          </button>
        </div>
        {viPhamComment && <span className="text-danger">Lỗi</span>}
      </div>
      <Modal
        show={modalShow}
        onHide={() => setModalShow(false)}
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Body>
          <ul className="comment-more-list list-group">
            <li
              className="list-group-item del"
              id="comment-del"
              onClick={(e) => handleSHow(e)}
            >
              Xóa
            </li>
            <li
              className="list-group-item edit"
              id="comment-edit"
              onClick={(e) => handleSHow(e)}
            >
              Sửa
            </li>
          </ul>
        </Modal.Body>
      </Modal>
      <Modal
        show={show}
        onHide={() => setShow(false)}
        size={commentedit === "comment-del" ? "sm" : "lg"}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Body>
          {commentedit === "comment-del" ? (
            <span>Bạn thực sự muốn xóa ?</span>
          ) : (
            <>
              <textarea
                className="comment-textarea-edit"
                value={contentEdit}
                onChange={(e) => setcontentEdit(e.target.value)}
              ></textarea>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Hủy
          </Button>
          <Button
            variant={commentedit === "comment-del" ? "danger" : "primary"}
            onClick={handleSuccess}
          >
            {commentedit === "comment-del" ? "Xóa" : "Sửa"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Comments;
