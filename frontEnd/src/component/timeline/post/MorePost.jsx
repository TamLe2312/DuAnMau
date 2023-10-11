import "./morepost.css";
import { useState, useContext, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
// import { toast } from "react-toastify";
import * as request from "../../../utils/request";
import { Context } from "../../../page/home/home";
import axios from "axios";

function MorePost(props) {
  const conTent = props.title;
  // console.log(conTent);
  const againPage = useContext(Context);
  const [modalShow, setModalShow] = useState(false);
  const [edit, setEdit] = useState(false);
  const [contentNew, setcontentNew] = useState(conTent);
  const [dis, setdis] = useState(false);
  const postID = props.id;
  // console.log(postID);
  const deletePost = () => {
    try {
      const fetchApi = async () => {
        const res2 = await request.deldete("post/deletePostImgs", { postID });
        const res = await request.deldete("post/deldete", { postID });
        if (res || res2) {
          props.show(false);
          // console.log(res2);
          againPage();
        }
      };
      fetchApi();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditPost = () => {
    setModalShow(true);
    setEdit(true);
  };
  const editPost = () => {
    try {
      const fetchApi = async () => {
        const res = await axios.post("http://localhost:8080/post/editPost", {
          content: contentNew,
          postID: postID,
        });
        if (res.status === 200) {
          props.show(false);
          againPage();
        }
      };
      fetchApi();
    } catch (err) {
      console.log(err);
      toast.error("Có lỗi xảy ra xin thử lại sau");
    }
  };

  useEffect(() => {
    const length = contentNew.trim().length;
    setdis(length === 0 ? true : false);
  }, [contentNew]);

  return (
    <>
      <div className="morepost">
        <ul className="morepost-list">
          <li className="morepost-list-item">
            <span
              className="morepost-list-item-child-red "
              onClick={() => {
                setModalShow(true);
                setEdit(false);
              }}
              onMouseDown={props.handleHide}
            >
              Xóa bài viết
            </span>
          </li>
          <li
            className="morepost-list-item-child"
            id="morepost-list-item-edit"
            onClick={handleEditPost}
          >
            Sửa tiêu đề
          </li>
          {/* <li className="morepost-list-item">Hết</li> */}
          <li></li>
        </ul>

        <Modal
          show={modalShow}
          onHide={() => setModalShow(false)}
          size={edit ? "lg" : "sm"}
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter">
              {/* Modal heading */}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {edit ? (
              <textarea
                className="edit-content-post"
                value={contentNew}
                onChange={(e) => setcontentNew(e.target.value)}
              ></textarea>
            ) : (
              <p>Bạn thực sự muốn xóa bài viết</p>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => setModalShow(false)}>Hủy</Button>
            {edit ? (
              <Button
                disabled={dis}
                className="btn btn-danger"
                onClick={editPost}
              >
                Sửa
              </Button>
            ) : (
              <Button className="btn btn-danger" onClick={deletePost}>
                Xóa
              </Button>
            )}
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
}

export default MorePost;
