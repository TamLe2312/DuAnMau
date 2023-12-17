import React, { useState, useEffect } from "react";
import Validation from "../../validation/validation";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "sonner";
import * as request from "../../../utils/request";

function BrandAdvertisement() {
  const [loading, setLoading] = useState(false);
  const [allDataBrand, setAllDataBrand] = useState([]);
  const [showModalConfirmDelete, setShowModalConfirmDelete] = useState(false);
  const [showModalCreateBrand, setShowModalCreateBrand] = useState(false);
  const [showModalAdjustInformation, setShowModalAdjustInformation] =
    useState(false);
  const [showMore, setShowMore] = useState(false);
  const [TotalPage, setTotalPage] = useState(1);
  const [indexPagination, setIndexPagination] = useState(1);
  const [formValuesCreateBrand, setFormValuesCreateBrand] = useState({
    brand: "",
  });
  const [formValuesAdjustBrand, setFormValuesAdjustBrand] = useState({
    brand: "",
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [IdBrandDelete, setIdBrandDelete] = useState(null);
  const [IdBrandAdjust, setIdBrandAdjust] = useState(null);

  const [indexImg, setIndexImg] = useState(0);
  const [error, setError] = useState({});
  const handleClickShowMore = () => {
    setShowMore(!showMore);
  };
  const handleChangeCreateBrand = (e) => {
    setFormValuesCreateBrand({
      ...formValuesCreateBrand,
      [e.target.name]: e.target.value,
    });
  };
  const handleShowModalConfirmDelete = (id) => {
    setIdBrandDelete(id);
    setShowModalConfirmDelete(true);
  };
  const handleShowModalCreateBrand = () => {
    setImageFiles([]);
    setError({});
    setFormValuesCreateBrand({
      content: "",
    });
    setShowModalCreateBrand(true);
  };
  const handleCloseModalConfirmDelete = () => {
    setShowModalConfirmDelete(false);
  };
  const handleCloseModalCreateBrand = () => {
    setShowModalCreateBrand(false);
  };
  const handleImageUpload = (event) => {
    setImageFiles([]);
    const selectedFile = event.target.files[0];
    if (!selectedFile) {
      toast.error("Chưa có ảnh");
      return;
    }
    if (selectedFile.length > 2) {
      toast.error("Chỉ up được 1 ảnh duy nhất");
      event.target.value = null;
      return;
    }
    if (!selectedFile.type.startsWith("image/")) {
      toast.error("Bạn đã up sai định dạng ảnh");
      event.target.value = null;
      return;
    }

    const maxSizeInBytes = 10 * 1024 * 1024; // 10MB
    if (selectedFile.size > maxSizeInBytes) {
      toast.error("File ảnh quá lớn");
      event.target.value = null;
      return;
    }

    setImageFiles([selectedFile]);
  };
  const handleSubmitCreateBrand = async (e) => {
    e.preventDefault();
    setError(Validation(formValuesCreateBrand));
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("brand", formValuesCreateBrand.brand);
      imageFiles.forEach((file, index) => {
        formData.append("avatar", file);
      });
      const response = await request.post("admin/createNewBrand", formData);
      if (response && response.data) {
        if (response.data.success) {
          toast.success(response.data.success);
        } else {
          toast.error(response.data.error);
        }
      }
      fetchDataAllBrand(indexPagination);
      setLoading(false);
      handleCloseModalCreateBrand();
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  const handlePaginationClick = (pageIndex) => {
    setIndexPagination(pageIndex, () => {
      fetchDataAllBrand(pageIndex);
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
        fetchDataAllBrand(indexPagination);
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
        fetchDataAllBrand(indexPagination);
      }
    );
  };
  useEffect(() => {
    fetchDataAllBrand(indexPagination);
  }, [indexPagination]);
  const fetchDataAllBrand = async (page) => {
    try {
      const response = await request.get(`admin/getDataBrand/${page}`);
      setTotalPage(response.data.pageCount);
      setAllDataBrand(response.data.results);
    } catch (error) {
      /*    console.error(error); */
      setAllDataBrand([]);
    }
  };
  const handleDeleteBrand = async () => {
    setLoading(true);
    try {
      const response = await request.post("admin/deleteBrand", {
        id: IdBrandDelete,
      });
      if (response.data.pageCount < TotalPage) {
        setTotalPage(response.data.pageCount);
        fetchDataAllBrand(response.data.pageCount);
        setIndexPagination(response.data.pageCount);
      }
      if (response.data.pageCount === 0) {
        setTotalPage(1);
        setIndexPagination(1);
      }
      fetchDataAllBrand(indexPagination);
      toast.success(response.data.success);
      handleCloseModalConfirmDelete();
      setLoading(false);
    } catch (error) {
      /*   console.error(error); */
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await request.get(`admin/getDataBrand/1`);
        setAllDataBrand(response.data.results);
      } catch (error) {
        /*     console.error(error); */
      }
    };
    fetchData();
  }, []);
  const handleShowModalAdjustBrand = (id) => {
    setIdBrandAdjust(id);
    setFormValuesAdjustBrand({
      brand: "",
    });
    setImageFiles([]);
    setError({});
    setShowModalAdjustInformation(true);
  };
  const handleCloseModalAdjustInformation = () => {
    setShowModalAdjustInformation(false);
  };
  const handleSubmitChangeInform = async (e) => {
    e.preventDefault();
    setError(Validation(formValuesAdjustBrand));
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("brand", formValuesAdjustBrand.brand);
      formData.append("id", IdBrandAdjust);
      imageFiles.forEach((file, index) => {
        formData.append(`avatar`, file);
      });
      const response = await request.post("admin/adjustBrand", formData);
      if (response && response.data) {
        if (response.data.success) {
          toast.success(response.data.success);
          handleCloseModalAdjustInformation();
        } else {
          toast.error(response.data.error);
        }
      }
      fetchDataAllBrand(indexPagination);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      // Handle Error
    }
  };
  const handleChangeAdjustUser = (e) => {
    setFormValuesAdjustBrand({
      ...formValuesAdjustBrand,
      [e.target.name]: e.target.value,
    });
  };
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        Thương hiệu
        <div style={{ marginRight: "50px" }}>
          <button
            className="btn btn-success"
            onClick={handleShowModalCreateBrand}
          >
            Thêm thương hiệu
          </button>
          <Modal
            centered
            show={showModalCreateBrand}
            onHide={handleCloseModalCreateBrand}
          >
            <Modal.Header closeButton>
              <Modal.Title>Tạo mới thương hiệu</Modal.Title>
            </Modal.Header>
            <Modal.Body className="ProfileInformationModalBody">
              <Form
                onSubmit={handleSubmitCreateBrand}
                encType="multipart/form-data"
              >
                <Form.Group controlId="formBrand">
                  <Form.Label>Thương hiệu</Form.Label>
                  <Form.Control
                    type="text"
                    name="brand"
                    value={formValuesCreateBrand.brand}
                    onChange={handleChangeCreateBrand}
                    className={
                      error.brand ? "form-control is-invalid" : "form-control"
                    }
                  />
                  {error.brand && (
                    <div
                      id="validationServerBrandFeedback"
                      className="invalid-feedback"
                    >
                      {error.brand}
                    </div>
                  )}
                </Form.Group>
                <Form.Group controlId="formImageUpload">
                  <Form.Label>Ảnh đại diện</Form.Label>
                  <Form.Control
                    type="file"
                    name="avatar"
                    onChange={handleImageUpload}
                  />
                </Form.Group>
                <br />
              </Form>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {imageFiles.map((file, index) => (
                  <div className="previewImg" key={index}>
                    <img src={file && URL.createObjectURL(file)} />
                  </div>
                ))}
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="primary"
                type="submit"
                onClick={handleSubmitCreateBrand}
              >
                {loading ? "Submit..." : "Submit"}
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Thương hiệu</th>
            <th scope="col">Ảnh đại diện</th>
            <th scope="col">Quản lí</th>
            {/* <th scope="col">Báo cáo</th> */}
          </tr>
        </thead>
        <tbody>
          {allDataBrand && allDataBrand.length > 0 ? (
            allDataBrand.map((dataAds, index) => {
              return (
                <React.Fragment key={index}>
                  <tr>
                    <th scope="row">{index + 1}</th>
                    <td className="AdminDescription">
                      <span>
                        {dataAds.brand &&
                        dataAds.brand.length > 100 &&
                        !showMore
                          ? dataAds.brand.slice(0, 100) + "..."
                          : dataAds.brand}
                      </span>
                      <br />
                      {dataAds.brand && dataAds.brand.length > 100 && (
                        <span
                          className="read-more"
                          onClick={handleClickShowMore}
                        >
                          {showMore ? "Rút gọn" : "Xem thêm"}
                        </span>
                      )}
                    </td>
                    <td>
                      {dataAds.avatarBrand ? (
                        <div className="AdminGroupsContentImg">
                          <img src={dataAds.avatarBrand} />
                        </div>
                      ) : (
                        <div className="AdminGroupsContentImg">
                          <img src="https://i.pinimg.com/564x/64/b9/dd/64b9dddabbcf4b5fb2b885927b7ede61.jpg" />
                        </div>
                      )}
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-danger btn-featureHandle"
                        onClick={() => handleShowModalConfirmDelete(dataAds.id)}
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                      &nbsp;
                      <button
                        type="button"
                        className="btn btn-primary btn-featureHandle"
                        onClick={() => handleShowModalAdjustBrand(dataAds.id)}
                      >
                        <i className="fa-solid fa-wrench"></i>
                      </button>
                      &nbsp;
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
                              onClick={handleDeleteBrand}
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
                        show={showModalAdjustInformation}
                        onHide={handleCloseModalAdjustInformation}
                      >
                        <Modal.Header closeButton>
                          <Modal.Title>
                            Chỉnh sửa thông tin thương hiệu
                          </Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="ProfileInformationModalBody">
                          <Form onSubmit={handleSubmitChangeInform}>
                            <Form.Group controlId="formName">
                              <Form.Label>Thương hiệu</Form.Label>
                              <Form.Control
                                type="text"
                                name="brand"
                                value={formValuesAdjustBrand.brand}
                                onChange={handleChangeAdjustUser}
                                className="form-control"
                              />
                            </Form.Group>
                            <Form.Group controlId="formImageUpload">
                              <Form.Label>Ảnh nội dung</Form.Label>
                              <Form.Control
                                type="file"
                                name="avatar"
                                onChange={handleImageUpload}
                              />
                            </Form.Group>
                            <br />
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
                </React.Fragment>
              );
            })
          ) : (
            <tr>
              <td colSpan={5}>Không có thương hiệu nào nào</td>
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
export default BrandAdvertisement;
