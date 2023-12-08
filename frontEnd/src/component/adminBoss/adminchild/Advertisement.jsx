import React, { useState, useEffect } from "react";
import moment from "moment";
import Validation from "../../validation/validation";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "sonner";
import * as request from "../../../utils/request";
import { useNavigate } from "react-router-dom";

function AdvertisementAdmin() {
  const [loading, setLoading] = useState(false);
  const [allDataAds, setAllDataAds] = useState([]);
  const [idAdsDelete, setIdAdsDelete] = useState(null);
  const [showModalConfirmDelete, setShowModalConfirmDelete] = useState(false);
  const [showModalCreateAds, setShowModalCreateAds] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [TotalPage, setTotalPage] = useState(1);
  const [indexPagination, setIndexPagination] = useState(1);
  const [formValuesCreateAds, setFormValuesCreateAds] = useState({
    brand: "",
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [indexImg, setIndexImg] = useState(0);
  const [error, setError] = useState({});
  const handleClickShowMore = () => {
    setShowMore(!showMore);
  };
  const handleChangeCreateAds = (e) => {
    setFormValuesCreateAds({
      ...formValuesCreateAds,
      [e.target.name]: e.target.value,
    });
  };
  const handleShowModalConfirmDelete = (id) => {
    setIdAdsDelete(id);
    setShowModalConfirmDelete(true);
  };
  const handleShowModalCreateAds = () => {
    setImageFiles([]);
    setFormValuesCreateAds({
      brand: "",
    });
    setShowModalCreateAds(true);
  };
  const handleCloseModalConfirmDelete = () => {
    setShowModalConfirmDelete(false);
  };
  const handleCloseModalCreateAds = () => {
    setShowModalCreateAds(false);
  };
  const handleImageUpload = (event) => {
    const selectedFiles = event.target.files;

    if (!selectedFiles || selectedFiles.length === 0) {
      toast.error("Chưa có ảnh");
      return;
    }
    const newImageFiles = [];

    Array.from(selectedFiles).forEach((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error("Bạn đã up sai định dạng ảnh");
        return;
      }

      const maxSizeInBytes = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSizeInBytes) {
        toast.error("File ảnh quá lớn");
        return;
      }
      newImageFiles.push(file);
    });

    setImageFiles([...imageFiles, ...newImageFiles]);

    event.target.value = null;
  };
  const handleSubmitCreateAds = async (e) => {
    e.preventDefault();
    setError(Validation(formValuesCreateAds));
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("brand", formValuesCreateAds.brand.trim());

      imageFiles.forEach((file, index) => {
        formData.append(`images`, file);
      });
      // Use the FormData object in the request.post call
      const response = await request.post("admin/createNewAds", formData);
      console.log(response);
      if (response.data.success) {
        toast.success(response.data.success);
      } else {
        toast.error(response.data.error);
      }

      fetchDataAllAds(indexPagination);
      setLoading(false);
      handleCloseModalCreateAds();
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  const handlePaginationClick = (pageIndex) => {
    setIndexPagination(pageIndex, () => {
      fetchDataAllAds(pageIndex);
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
        fetchDataAllAds(indexPagination);
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
        fetchDataAllAds(indexPagination);
      }
    );
  };
  useEffect(() => {
    fetchDataAllAds(indexPagination);
  }, [indexPagination]);
  const fetchDataAllAds = async (page) => {
    try {
      const response = await request.get(`admin/getDataAllAds/${page}`);
      setTotalPage(response.data.pageCount);
      setAllDataAds(response.data.results);
    } catch (error) {
      /*    console.error(error); */
      setAllDataAds([]);
    }
  };
  const handleDeleteAds = async () => {
    setLoading(true);
    try {
      const res = await request.post("admin/deleteAds", {
        idAds: idAdsDelete,
      });
      if (res.data.pageCount < TotalPage) {
        setTotalPage(res.data.pageCount);
        fetchDataAllAds(res.data.pageCount);
        setIndexPagination(res.data.pageCount);
      }
      if (res.data.pageCount === 0) {
        setTotalPage(1);
        setIndexPagination(1);
      }
      fetchDataAllAds(indexPagination);
      toast.success(res.data.success);
      handleCloseModalConfirmDelete();
      setLoading(false);
    } catch (error) {
      /*    console.error(error); */
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await request.get(`admin/getDataAllAds/1`);
        setAllDataAds(response.data.results);
      } catch (error) {
        /*     console.error(error); */
      }
    };
    fetchData();
  }, []);
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        Quảng cáo
        <div style={{ marginRight: "50px" }}>
          <button
            className="btn btn-success"
            onClick={handleShowModalCreateAds}
          >
            Thêm quảng cáo
          </button>
          <Modal
            centered
            show={showModalCreateAds}
            onHide={handleCloseModalCreateAds}
          >
            <Modal.Header closeButton>
              <Modal.Title>Tạo mới quảng cáo</Modal.Title>
            </Modal.Header>
            <Modal.Body className="ProfileInformationModalBody">
              <Form onSubmit={handleSubmitCreateAds}>
                <Form.Group controlId="formUsername">
                  <Form.Label>Thương hiệu</Form.Label>
                  <Form.Control
                    type="text"
                    name="brand"
                    value={formValuesCreateAds.brand}
                    onChange={handleChangeCreateAds}
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
                  <Form.Label>Ảnh</Form.Label>
                  <Form.Control
                    type="file"
                    name="images"
                    onChange={handleImageUpload}
                    multiple
                  />
                  {/* You can add error handling for image upload if needed */}
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
                {imageFiles && imageFiles.length > 0 && (
                  <div className="advertisementButton">
                    <button
                      onClick={() =>
                        setIndexImg((prevIndex) =>
                          prevIndex > 0 ? prevIndex - 1 : imageFiles.length - 1
                        )
                      }
                    >
                      <i className="fa-solid fa-chevron-left"></i>
                    </button>
                  </div>
                )}
                <div className="previewImg">
                  {imageFiles && imageFiles.length > 0 && (
                    <img
                      src={URL.createObjectURL(imageFiles[indexImg])}
                      alt={`Preview ${indexImg}`}
                    />
                  )}
                </div>
                {imageFiles && imageFiles.length > 0 && (
                  <div className="advertisementButton">
                    <button
                      onClick={() =>
                        setIndexImg((prevIndex) =>
                          prevIndex < imageFiles.length - 1 ? prevIndex + 1 : 0
                        )
                      }
                    >
                      <i className="fa-solid fa-chevron-right"></i>
                    </button>
                  </div>
                )}
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="primary"
                type="submit"
                onClick={handleSubmitCreateAds}
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
            <th scope="col">Quản lí</th>
            {/* <th scope="col">Báo cáo</th> */}
          </tr>
        </thead>
        <tbody>
          {allDataAds && allDataAds.length > 0 ? (
            allDataAds.map((dataAds, index) => {
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
                        /*             onClick={() => handleShowModalMoreDetailPost(dataAds)} */
                      >
                        <i className="fa-solid fa-info"></i>
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
                            <Button variant="danger" onClick={handleDeleteAds}>
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
                    </td>
                  </tr>
                </React.Fragment>
              );
            })
          ) : (
            <tr>
              <td colSpan={5}>Không có quảng cáo nào</td>
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
export default AdvertisementAdmin;
