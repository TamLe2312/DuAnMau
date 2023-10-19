import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import Validation from "../../validation/validation";
import { toast } from "sonner";
import * as request from "../../../utils/request";

function GroupsTable() {
  const [AllDataGroup, setAllDataGroup] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModalConfirmDelete, setShowModalConfirmDelete] = useState(false);
  const [showModalAdjustGroup, setShowModalAdjustGroup] = useState(false);
  const [IdGroupDelete, setIdGroupDelete] = useState(null);
  const [IdGroupAdjust, setIdGroupAdjust] = useState(null);
  const [formValues, setFormValues] = useState({
    name: "",
    moTaNhom: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [Images, setImages] = useState(null);
  const [hasAvatar, setHasAvatar] = useState(null);
  const [TotalPage, setTotalPage] = useState(1);
  const [indexPagination, setIndexPagination] = useState(1);
  const handleChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };
  const handleInputChange = async (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) {
      setImages(null);
      setSelectedImage(null);
      toast.error("Chưa có ảnh");
      return; // Dừng việc xử lý nếu không có file được chọn
    }
    // Kiểm tra nếu selectedFile không phải là file ảnh
    if (!selectedFile.type.startsWith("image/")) {
      toast.error("Bạn đã up sai định dạng ảnh");
      event.target.value = null;
      return;
    }

    // Kiểm tra kích thước của file ảnh
    const maxSizeInBytes = 10 * 1024 * 1024; // 10MB
    if (selectedFile.size > maxSizeInBytes) {
      toast.error("File ảnh quá lớn");
      event.target.value = null;
      return;
    }
    const imageUrl = URL.createObjectURL(selectedFile);
    setSelectedImage(imageUrl);
    setImages(selectedFile);
  };
  const handleShowModalConfirmDelete = (id) => {
    setIdGroupDelete(id);
    setShowModalConfirmDelete(true);
  };
  const handleCloseModalConfirmDelete = () => {
    setShowModalConfirmDelete(false);
  };
  const handleShowModalAdjustGroup = (id, avatar) => {
    setIdGroupAdjust(id);
    setHasAvatar(avatar);
    setShowModalAdjustGroup(true);
  };
  const handleCloseModalAdjustGroup = () => {
    setFormValues({
      name: "",
      moTaNhom: "",
    });
    setSelectedImage(null);
    setShowModalAdjustGroup(false);
  };
  const handleSubmitChangeInform = async () => {
    try {
      const formData = new FormData();
      formData.append("avatar", Images);
      formData.append("idGroup", IdGroupAdjust);
      formData.append("hasAvatar", hasAvatar);

      const response = await request.post("admin/adjustGroupInform", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data.success) {
        toast.success(response.data.success);
        fetchDataAllGroup();
        handleCloseModalAdjustGroup();
      }
    } catch (error) {
      if (error.response.data.UpdateNoImg) {
        try {
          const response = await request.post(
            "admin/adjustGroupInformContent",
            {
              name: formValues.name,
              moTaNhom: formValues.moTaNhom,
              idGroup: IdGroupAdjust,
            }
          );
          if (response.data.success) {
            toast.success(response.data.success);
            fetchDataAllGroup();
            handleCloseModalAdjustGroup();
          }
        } catch (err) {
          toast.error(err.response.data.error);
        }
      }
    }
  };
  const handleDeleteGroup = async () => {
    setLoading(true);
    try {
      const response = await request.post("admin/deleteGroup", {
        idGroup: IdGroupDelete,
      });
      if (response.data.pageCount < TotalPage) {
        setTotalPage(response.data.pageCount);
        fetchDataAllGroup(response.data.pageCount);
        setIndexPagination(response.data.pageCount);
      }
      if (response.data.pageCount === 0) {
        setTotalPage(1);
        setIndexPagination(1);
      }
      fetchDataAllGroup(indexPagination);
      toast.success(response.data.success);
      handleCloseModalConfirmDelete();
      setLoading(false);
    } catch (error) {
      /* console.error(error); */
    }
  };
  const handlePaginationClick = (pageIndex) => {
    setIndexPagination(pageIndex, () => {
      fetchDataAllGroup(pageIndex);
    });
  };

  const handlePrevIndex = () => {
    setIndexPagination(
      (prevIndex) => {
        if (prevIndex > 1) {
          return prevIndex - 1;
        }
        return prevIndex;
      },
      () => {
        fetchDataAllGroup(indexPagination);
      }
    );
  };

  const handleNextIndex = () => {
    setIndexPagination(
      (prevIndex) => {
        if (prevIndex < TotalPage) {
          return prevIndex + 1;
        }
        return prevIndex;
      },
      () => {
        fetchDataAllGroup(indexPagination);
      }
    );
  };
  const fetchDataAllGroup = async (page) => {
    try {
      const response = await request.get(`admin/getDataAllGroup/${page}`);
      setAllDataGroup(response.data.results);
      setTotalPage(response.data.pageCount);
      setIndexPagination(page);
    } catch (error) {
      /*  console.error(error); */
      setAllDataGroup([]);
    }
  };
  useEffect(() => {
    fetchDataAllGroup(indexPagination);
  }, [indexPagination]);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await request.get("admin/getDataAllGroup/1");
        setTotalPage(response.data.pageCount);
        setAllDataGroup(response.data.results);
        setLoading(false);
      } catch (error) {
        /*    console.error(error); */
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <table className="table table-sm">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Tên nhóm</th>
            <th scope="col">Mô tả nhóm</th>
            <th scope="col">Avatar</th>
            <th scope="col">Người tạo</th>
            <th scope="col">Quản lí</th>
          </tr>
        </thead>
        <tbody>
          {!loading ? (
            AllDataGroup && AllDataGroup.length > 0 ? (
              AllDataGroup.map((dataGroup, index) => {
                return (
                  <>
                    <tr key={index}>
                      <th scope="row">{index + 1}</th>
                      <td>{dataGroup.name}</td>
                      <td>{dataGroup.moTaNhom}</td>
                      <td>
                        {dataGroup.avatarGroup ? (
                          <div className="AdminGroupsContentImg">
                            <img
                              src={dataGroup.avatarGroup}
                              alt={dataGroup.name}
                            />
                          </div>
                        ) : (
                          <div className="AdminGroupsContentImg">
                            <img src="https://i.pinimg.com/564x/64/b9/dd/64b9dddabbcf4b5fb2b885927b7ede61.jpg" />
                          </div>
                        )}
                      </td>
                      <td>
                        {dataGroup.nameUser
                          ? dataGroup.nameUser
                          : dataGroup.usernameUser}
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={() =>
                            handleShowModalAdjustGroup(
                              dataGroup.id,
                              dataGroup.avatarGroup
                            )
                          }
                        >
                          Sửa
                        </button>
                        &nbsp;
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={() =>
                            handleShowModalConfirmDelete(dataGroup.id)
                          }
                        >
                          Xóa
                        </button>
                        <Modal
                          centered
                          show={showModalConfirmDelete}
                          onHide={handleCloseModalConfirmDelete}
                        >
                          <Modal.Body className="ConfirmDeleteModalBody">
                            <h4>Xác nhận xóa nhóm này ?</h4>
                            <div>
                              <Button
                                variant="danger"
                                onClick={handleDeleteGroup}
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
                          centered
                          show={showModalAdjustGroup}
                          onHide={handleCloseModalAdjustGroup}
                        >
                          <Modal.Header closeButton>
                            <Modal.Title>Chỉnh sửa thông tin nhóm</Modal.Title>
                          </Modal.Header>
                          <Modal.Body className="ProfileInformationModalBody">
                            <Form onSubmit={handleSubmitChangeInform}>
                              <Form.Group controlId="formName">
                                <Form.Label>Tên nhóm</Form.Label>
                                <Form.Control
                                  type="text"
                                  name="name"
                                  value={formValues.name}
                                  onChange={handleChange}
                                  className="form-control"
                                />
                              </Form.Group>

                              <Form.Group controlId="formDescription">
                                <Form.Label>Mô tả nhóm</Form.Label>
                                <Form.Control
                                  type="text"
                                  name="moTaNhom"
                                  value={formValues.moTaNhom}
                                  onChange={handleChange}
                                  className="form-control"
                                />
                              </Form.Group>

                              <Form.Group>
                                <Form.Label
                                  className="HandleButtonUploadFileAdmin"
                                  htmlFor="ProfileUploadFile"
                                >
                                  <i className="fa-regular fa-image"></i>
                                  Tải ảnh đại diện
                                </Form.Label>
                                <Form.Control
                                  type="file"
                                  name="avatarGroup"
                                  accept="image/*"
                                  id="ProfileUploadFile"
                                  onChange={handleInputChange}
                                  required
                                />
                              </Form.Group>
                              {selectedImage ? (
                                <div className="ProfileShowImageContainer">
                                  <img
                                    className="ShowImageWhenUpload"
                                    src={selectedImage}
                                    alt="Avatar"
                                  />
                                </div>
                              ) : (
                                <div></div>
                              )}
                            </Form>
                          </Modal.Body>
                          <Modal.Footer>
                            <Button
                              variant="primary"
                              type="submit"
                              onClick={handleSubmitChangeInform}
                            >
                              {loading ? "Submit..." : "Submit"}
                            </Button>
                          </Modal.Footer>
                        </Modal>
                      </td>
                    </tr>
                  </>
                );
              })
            ) : (
              <tr>
                <td colSpan={6}>Không có nhóm nào</td>
              </tr>
            )
          ) : (
            <tr>
              <td>Loading....</td>
            </tr>
          )}
        </tbody>
      </table>
      <nav aria-label="Page navigation example">
        <ul className="pagination justify-content-center">
          <li
            className={
              indexPagination === 1 ? "page-item disabled" : "page-item"
            }
          >
            <a className="page-link" tabIndex="-1" onClick={handlePrevIndex}>
              Previous
            </a>
          </li>
          {TotalPage &&
            Array.from({ length: TotalPage }, (_, index) => (
              <li className="page-item" key={index}>
                <a
                  className={
                    indexPagination === index + 1
                      ? "page-link active"
                      : "page-link"
                  }
                  onClick={() => handlePaginationClick(index + 1)}
                >
                  {index + 1}
                </a>
              </li>
            ))}
          <li
            className={
              indexPagination === TotalPage ? "page-item disabled" : "page-item"
            }
          >
            <a className="page-link" onClick={handleNextIndex}>
              Next
            </a>
          </li>
        </ul>
      </nav>
    </>
  );
}
export default GroupsTable;
