import React from "react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import moment from "moment";
import * as postService from "../../../services/AdPostService";
import "./adComment.scss";
import Modal from "react-bootstrap/Modal";
const Commentad = () => {
  // lấy giá trị từ đường dẫn
  const location = useLocation();
  const postDetail = location.state;
  const [photos, setphotos] = useState(true);
  const [show, setShow] = useState(false);
  const handleComment = () => {
    setphotos(true);
  };
  const handlePhoto = () => {
    setphotos(false);
  };
  const format = (time) => {
    let currentDate = moment(time).format("MMMM Do YYYY, h:mm:ss a");
    return currentDate;
  };

  const [ban, setban] = useState(false);
  const handleCam = (e) => {
    const fetchBan = async () => {
      await postService.banComments(e.id);
      setban((pre) => !pre);
    };
    fetchBan();
  };
  const [idComment, setIdComment] = useState(null);
  const handleDel = (e) => {
    setIdComment(e.id);
    setShow(true);
  };
  const handleClose = () => setShow(false);
  //   xóa
  const handleXoa = () => {
    const fetchDel = async () => {
      await postService.delComments(idComment);
      let a = dataComment.filter((item) => item.id !== idComment);
      setdataComment(a);
      setShow(false);
    };
    fetchDel();
  };
  //   call api list comment
  const [dataComment, setdataComment] = useState([]);
  useEffect(() => {
    const chay = async () => {
      const data = await postService.fetchComments(postDetail.id, 1);
      setdataComment(data);
    };
    chay();
  }, [ban]);
  // console.log(dataComment);
  return (
    <>
      <div className="container-fluit comment_ad">
        <Link to="/home/admin/posts">Quay lại</Link>
        <div>
          {postDetail && (
            <>
              <span>{postDetail.username}: </span>
              <span>{postDetail.content}</span>
            </>
          )}
        </div>
        <div className="row mt-4">
          <div className="col-md-3">
            <ul className="list-group comment_ad_listmenu">
              <li
                className={
                  photos
                    ? "list-group-item list-group-item-action comment_aitem"
                    : "list-group-item"
                }
                onClick={handleComment}
              >
                Bình luận
              </li>
              <li
                className={
                  !photos
                    ? "list-group-item list-group-item-action comment_aitem"
                    : "list-group-item"
                }
                onClick={handlePhoto}
              >
                Ảnh
              </li>
            </ul>
          </div>
          {/* sử lí ở đây */}
          <div className="col-md-9">
            {photos ? (
              //   comment
              dataComment && dataComment.length > 0 ? (
                <table className="table table-hover ">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Tác giả</th>
                      <th scope="col">Nội dung</th>
                      <th scope="col">Thời gian</th>
                      <th scope="col">Xử lí</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* loop ở đây */}
                    {dataComment.map((item, index) => (
                      <React.Fragment key={index}>
                        <tr>
                          <th scope="row">{index + 1}</th>
                          <td>{item.name ?? item.username}</td>
                          <td>{item.content}</td>
                          <td>{format(item.created_at)}</td>

                          <td>
                            <span
                              className="btn btn-danger"
                              onClick={() => handleDel(item)}
                            >
                              Xóa
                            </span>{" "}
                            <span
                              className={
                                item.ban == 1
                                  ? "btn btn-warning"
                                  : "btn btn-secondary"
                              }
                              onClick={() => handleCam(item)}
                            >
                              {item.ban == 1 ? "UnBan" : "Ban"}
                            </span>
                          </td>
                        </tr>
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              ) : (
                "Không có bình luận"
              )
            ) : (
              //    ảnh
              <div>Bài viết không có hình ảnh</div>
            )}
          </div>
        </div>
      </div>
      {/* MoDal */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body> Bạn muốn xóa bình luận này?</Modal.Body>
        <Modal.Footer>
          <div>
            <button className="btn btn-secondary" onClick={handleClose}>
              Hủy
            </button>{" "}
            <button className="btn btn-danger" onClick={handleXoa}>
              Xóa
            </button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Commentad;
