import axios from "axios";
import React, { useState, useEffect } from "react";
import moment from "moment";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Modal, Button, Form } from "react-bootstrap";
import Validation from "../../validation/validation";
import { toast } from "sonner";

function Posts() {
    const [AllDataPost, setAllDataPost] = useState([]);
    const [IdPostDelete, setIdPostDelete] = useState(null);
    const [IdPostDetail, setIdPostDetail] = useState(null);
    const [run, setRun] = useState(0);
    const [loading, setLoading] = useState(false);
    const [showModalConfirmDelete, setShowModalConfirmDelete] = useState(false);
    const [showModalMoreDetailPost, setShowModalMoreDetailPost] = useState(false);
    const handleShowModalConfirmDelete = (id) => {
        setIdPostDelete(id);
        setShowModalConfirmDelete(true);
    };
    const handleCloseModalConfirmDelete = () => {
        setShowModalConfirmDelete(false);
    };
    const [imgs, setImgs] = useState([]);
    const handleShowModalMoreDetailPost = async (id) => {
        try {
            setIdPostDetail(id); // Cập nhật id trước khi gọi yêu cầu axios
            const response = await axios.get(`http://localhost:8080/admin/postImgs/${id}`);
            setImgs(response.data);
        } catch (err) {
            console.error(err);
        }
        setShowModalMoreDetailPost(true);
    };
    const handleCloseModalMoreDetailPost = () => {
        setShowModalMoreDetailPost(false);
    };
    const handleDeletePost = async () => {
        setLoading(true);
        try {
            const response = await axios.post("http://localhost:8080/admin/deletePost", {
                idPost: IdPostDelete,
            });
            console.log(response);
            toast.success(response.data.success);
            fetchDataAllPost();
            handleCloseModalConfirmDelete();
            setLoading(false);
        } catch (error) {
            console.error(error);
        }
    }
    const fetchDataAllPost = async () => {
        try {
            const response = await axios.get("http://localhost:8080/admin/getDataAllPost");
            if (response && response.data) {
                const formattedData = response.data.map((item) => {
                    const createdAt = item.created_at;
                    const formattedDate = moment(createdAt).format("MMMM Do, YYYY");
                    return {
                        ...item,
                        created_at: formattedDate,
                    };
                });
                setAllDataPost(formattedData);
            } else {
                setAllDataPost([]);
            }
        } catch (error) {
            console.error(error);
            setAllDataPost([]);
        }
    };
    const handleRun = (e) => {
        if (imgs) {
            const id = e.currentTarget.id;
            const length = imgs.length;
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
                const response = await axios.get("http://localhost:8080/admin/getDataAllPost");
                if (response && response.data) {
                    const formattedData = response.data.map((item) => {
                        const createdAt = item.created_at;
                        const formattedDate = moment(createdAt).format("MMMM Do, YYYY");
                        return {
                            ...item,
                            created_at: formattedDate,
                        };
                    });
                    setAllDataPost(formattedData);
                } else {
                    setAllDataPost([]);
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);
    return (
        <>
            <div>Bài viết</div>
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Nội dung</th>
                        <th scope="col">Người đăng</th>
                        <th scope="col">Thời gian</th>
                        <th scope="col">Quản lí</th>
                    </tr>
                </thead>
                <tbody>
                    {AllDataPost && AllDataPost.length > 0 ? (
                        AllDataPost.map((dataPost, index) => {
                            return (
                                <>
                                    <tr key={index}>
                                        <th scope="row">{index + 1}</th>
                                        <td>{dataPost.content}</td>
                                        <td>{dataPost.name ? dataPost.name : dataPost.username}</td>
                                        <td>{dataPost.created_at}</td>
                                        <td>
                                            <button type="button" className="btn btn-danger" onClick={() => handleShowModalConfirmDelete(dataPost.id)}>
                                                Xóa
                                            </button>
                                            &nbsp;
                                            <button type="button" className="btn btn-primary" onClick={() => handleShowModalMoreDetailPost(dataPost.id)}>
                                                Chi tiết
                                            </button>
                                            <Modal
                                                centered
                                                show={showModalConfirmDelete}
                                                onHide={handleCloseModalConfirmDelete}
                                            >
                                                <Modal.Body className="ConfirmDeleteModalBody">
                                                    <h4>Xác nhận xóa bài viết này ?</h4>
                                                    <div>
                                                        <Button
                                                            variant="danger"
                                                            onClick={handleDeletePost}
                                                        >
                                                            {loading ? "Deleting..." : "Yes"}
                                                        </Button>
                                                        <Button
                                                            variant="primary"
                                                            onClick={handleCloseModalConfirmDelete}
                                                        >
                                                            {loading ? "No..." : "No"}
                                                        </Button>
                                                    </div>
                                                </Modal.Body>
                                            </Modal>
                                            <Modal
                                                show={showModalMoreDetailPost}
                                                onHide={handleCloseModalMoreDetailPost}
                                            >
                                                <Modal.Header closeButton>
                                                    Chi tiết bài viết
                                                </Modal.Header>
                                                <Modal.Body className="ConfirmDeleteModalBody">
                                                    <div className="MoreDetailContainerImg">
                                                        {imgs && imgs.length > 0 ? (
                                                            <>
                                                                <img
                                                                    src={
                                                                        "http://localhost:8080/images/" +
                                                                        (imgs.length === 1 ? imgs[0].img : imgs[run].img)
                                                                    }
                                                                    alt=""
                                                                />
                                                                {imgs.length > 1 && (
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
                                                                            {run + 1}/{imgs.length}
                                                                        </span>
                                                                    </>
                                                                )}
                                                            </>
                                                        ) : (
                                                            <div style={{ display: "flex", fontSize: '1.5rem', fontWeight: 500, justifyContent: "center" }}>Không có ảnh trong này</div>
                                                        )}
                                                    </div>
                                                </Modal.Body>
                                            </Modal>
                                        </td>
                                    </tr>
                                </>
                            )
                        })
                    ) :
                        (
                            <tr><td colSpan={5}>Không có post nào</td></tr>
                        )
                    }
                </tbody>
            </table>
        </>
    )
}
export default Posts