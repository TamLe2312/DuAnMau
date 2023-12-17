import { Toaster, toast } from "sonner";
import "./morepost.css";
import { useState, useContext, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import * as request from "../../../utils/request";
import { Context } from "../../../page/home/home";
import { useCookies } from "react-cookie";
import * as postService from "../../../services/AdPostService";
function MorePost(props) {
  const [cookies] = useCookies();
  const myID = cookies.userId;
  const conTent = props.title || props.content;
  const againPage = useContext(Context);
  const [modalShow, setModalShow] = useState(false);
  const [edit, setEdit] = useState(false);
  const [contentNew, setcontentNew] = useState(conTent);
  const [dis, setdis] = useState(false);
  const postID = props.id;
  const userid = props.userid;
  const groupPostId = props.groupPostId;
  // console.log(postID);
  const deletePost = () => {
    try {
      const fetchApi = async () => {
        if (groupPostId) {
          const res2 = await request.deldete("post/deletePostImgs", {
            groupPostId,
          });
          const res = await request.deldete("post/deldete", { groupPostId });
          if (res || res2) {
            props.show(false);
            if (res.successWithoutImgs && res) {
              toast.success(res.successWithoutImgs);
            }
            if (res2.successWithImgs && res2) {
              toast.success(res.successWithImgs);
            }
          }
        } else {
          const res2 = await request.deldete("post/deletePostImgs", { postID });
          const res = await request.deldete("post/deldete", { postID });
          if (res || res2) {
            props.show(false);
            if (res2.successWithImgs && res2) {
              toast.success(res2.successWithImgs);
            }
            if (res.successWithoutImgs && res) {
              toast.success(res.successWithoutImgs);
            }
            againPage();
          }
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
    setbaocao(false);
  };
  const editPost = () => {
    try {
      const fetchApi = async () => {
        if (groupPostId) {
          const res = await request.post("post/editPost", {
            content: contentNew,
            groupPostId: groupPostId,
          });
          if (res.status === 200) {
            props.show(false);
            console.log(res);
            toast.success(res.data.success);
          }
        } else {
          const res = await request.post("post/editPost", {
            content: contentNew,
            postID: postID,
          });
          if (res.status === 200) {
            props.show(false);
            toast.success(res.data.success);
            againPage();
          }
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
  const [baocao, setbaocao] = useState(false);
  const baoCao = () => {
    setModalShow(true);
    // setEdit(true);
    setbaocao(true);
  };
  const listBaoCao = [
    "Bán hàng trái phép",
    "Ảnh khỏa thân",
    "Spam",
    "Bạo lực",
    "Quấy rối",
    "Khủng bố",
    "Rối loạn ăn uống",
    "Ngôn từ gây thù gét",
    "Vấn đề khác",
  ];
  const handleBaoCaoOK = async (data) => {
    const res = await postService.flagPost(myID, props.id, data);
    toast.success(res.success);
    setModalShow(false);
  };
  return (
    <>
      <div className="morepost">
        <ul className="morepost-list">
          {userid === myID && (
            <>
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
            </>
          )}

          <li className="morepost-list-item-child" onClick={baoCao}>
            Báo cáo
          </li>
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
            {baocao ? (
              <ul className="list-group baocaonguoidung">
                {listBaoCao.map((item, index) => (
                  <li
                    onClick={() => handleBaoCaoOK(item)}
                    key={index}
                    className="list-group-item"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            ) : edit ? (
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
            {baocao ? (
              ""
            ) : edit ? (
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
