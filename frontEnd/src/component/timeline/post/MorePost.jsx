import "./morepost.css";
import { useState, useContext } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { toast } from "react-toastify";
import * as request from "../../../utils/request";

import { Context } from "../../../page/home/home";

function MorePost(props) {
  const againPage = useContext(Context);
  const [modalShow, setModalShow] = useState(false);
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
          // console.log("xóa bài viết thành công");
          toast.success("xóa bài viết thành công");
          againPage();
        }
      };
      fetchApi();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="morepost">
      <ul className="morepost-list">
        <li className="morepost-list-item">
          <span
            className="morepost-list-item-child"
            onClick={() => {
              setModalShow(true);
            }}
            onMouseDown={props.handleHide}
          >
            Xóa bài viết
          </span>
        </li>
        <li className="morepost-list-item">Hết</li>
        <li></li>
      </ul>

      <Modal
        show={modalShow}
        onHide={() => setModalShow(false)}
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">
            {/* Modal heading */}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Bạn thực sự muốn xóa bài viết</p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setModalShow(false)}>Hủy</Button>
          <Button className="btn btn-danger" onClick={deletePost}>
            Xóa
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default MorePost;
