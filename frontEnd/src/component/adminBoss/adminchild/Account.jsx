import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import Validation from "../../validation/validation";
import { toast } from "sonner";
import * as request from "../../../utils/request";

function Account() {
  const [showModalConfirmDelete, setShowModalConfirmDelete] = useState(false);
  const [showModalAdjustInformation, setShowModalAdjustInformation] =
    useState(false);
  const [showModalCreateUser, setShowModalCreateUser] = useState(false);
  const [IdUserDelete, setIdUserDelete] = useState(null);
  const [IdUserAdjust, setIdUserAdjust] = useState(null);
  const [TotalPage, setTotalPage] = useState(1);
  const [indexPagination, setIndexPagination] = useState(1);
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const [formValuesAdjustUser, setFormValuesAdjustUser] = useState({
    nameUser: "",
    usernameUser: "",
    role: "",
  });
  const [formValuesCreateUser, setFormValuesCreateUser] = useState({
    role: "",
    username: "",
    password: "",
    Cpassword: "",
    email: "",
  });

  const handleChangeAdjustUser = (e) => {
    setFormValuesAdjustUser({
      ...formValuesAdjustUser,
      [e.target.name]: e.target.value,
    });
  };
  const handleChangeCreateUser = (e) => {
    setFormValuesCreateUser({
      ...formValuesCreateUser,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmitChangeInform = async (e) => {
    e.preventDefault();
    setError(Validation(formValuesAdjustUser));
    try {
      setLoading(true);
      const currentPage = indexPagination; // Lưu giá trị trang hiện tại
      const response = await request.post("admin/adjustInformUser", {
        nameUser: formValuesAdjustUser.nameUser,
        usernameUser: formValuesAdjustUser.usernameUser,
        role: formValuesAdjustUser.role.trim(),
        idUser: IdUserAdjust,
      });
      if (response.data.success) {
        toast.success(response.data.success);
      }
      fetchDataAllUser(currentPage); // Sử dụng giá trị trang hiện tại
      setLoading(false);
      handleCloseModalAdjustInformation();
    } catch (error) {
      /*     console.log(error); */
      toast.error(error.response.data.error);
      setLoading(false);
    }
  };
  const handleShowModalConfirmDelete = (id) => {
    setIdUserDelete(id);
    setShowModalConfirmDelete(true);
  };
  const handleCloseModalConfirmDelete = () => {
    setShowModalConfirmDelete(false);
  };
  const handleShowModalAdjustInformatione = (id) => {
    setIdUserAdjust(id);
    setShowModalAdjustInformation(true);
  };
  const handleCloseModalAdjustInformation = () => {
    setFormValuesAdjustUser({
      nameUser: "",
      usernameUser: "",
      role: "",
    });
    setError({});
    setShowModalAdjustInformation(false);
  };
  const handleShowModalCreateUser = () => {
    setShowModalCreateUser(true);
  };
  const handleCloseModalCreateUser = () => {
    setFormValuesCreateUser({
      username: "",
      password: "",
      Cpassword: "",
      role: "",
      email: "",
    });
    setError({});
    setShowModalCreateUser(false);
  };
  const fetchDataAllUser = async (page) => {
    try {
      const response = await request.get(`admin/getDataAllUser/${page}`);
      setAllDataUser(response.data.results);
      setTotalPage(response.data.pageCount);
      setIndexPagination(page);
    } catch (error) {
      /* console.error(error); */
      setAllDataUser([]);
    }
  };

  const handleDeleteUser = async () => {
    setLoading(true);
    try {
      const response = await request.post("admin/deleteUser", {
        idUser: IdUserDelete,
      });
      if (response.data.pageCount < TotalPage) {
        setTotalPage(response.data.pageCount);
        fetchDataAllUser(response.data.pageCount);
        setIndexPagination(response.data.pageCount);
      }
      if (response.data.pageCount === 0) {
        setTotalPage(1);
        setIndexPagination(1);
      }
      fetchDataAllUser(indexPagination);
      toast.success(response.data.success);
      handleCloseModalConfirmDelete();
      setLoading(false);
    } catch (error) {
      /*   console.error(error); */
    }
  };
  const handleSubmitCreateUser = async (e) => {
    e.preventDefault();
    setError(Validation(formValuesCreateUser));
    try {
      setLoading(true);
      const response = await request.post("admin/createNewUser", {
        username: formValuesCreateUser.username.trim(),
        password: formValuesCreateUser.password.trim(),
        Cpassword: formValuesCreateUser.Cpassword.trim(),
        email: formValuesCreateUser.email.trim(),
        role: formValuesCreateUser.role.trim(),
      });
      if (response.data.success) {
        toast.success(response.data.success);
      }
      fetchDataAllUser(indexPagination);
      setLoading(false);
      handleCloseModalCreateUser();
    } catch (error) {
      toast.error(error.response.data.error);
      setLoading(false);
    }
  };
  const handlePaginationClick = (pageIndex) => {
    setIndexPagination(pageIndex, () => {
      fetchDataAllUser(pageIndex);
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
        fetchDataAllUser(indexPagination);
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
        fetchDataAllUser(indexPagination);
      }
    );
  };

  useEffect(() => {
    fetchDataAllUser(indexPagination);
  }, [indexPagination]);
  const [AllDataUser, setAllDataUser] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await request.get("admin/getDataAllUser/1");
        setTotalPage(response.data.pageCount);
        setAllDataUser(response.data.results);
      } catch (error) {
        /*       */
        setAllDataUser([]);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        Tài khoản
        <div style={{ marginRight: "50px" }}>
          <button
            className="btn btn-success"
            onClick={handleShowModalCreateUser}
          >
            Thêm tài khoản
          </button>
        </div>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Tên</th>
            <th scope="col">Username</th>
            <th scope="col">Role</th>
            <th scope="col">Quản lí</th>
          </tr>
        </thead>
        <tbody>
          {/* {AllDataUser &&
            AllDataUser.map((dataUser, index) => {
              return (
                <React.Fragment key={index}>
                  <tr>
                    <th scope="row">{index + 1}</th>
                    <td>
                      {dataUser && dataUser.name
                        ? dataUser.name
                        : "Không có name"}
                    </td>
                    <td>{dataUser.username}</td>
                    <td>{dataUser.role}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-primary btn-featureHandle"
                        onClick={() =>
                          handleShowModalAdjustInformatione(dataUser.id)
                        }
                      >
                        <i className="fa-solid fa-wrench"></i>
                      </button>
                      &nbsp;
                      <button
                        type="button"
                        className="btn btn-danger btn-featureHandle"
                        onClick={() =>
                          handleShowModalConfirmDelete(dataUser.id)
                        }
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                </React.Fragment>
              );
            })} */}

          {AllDataUser &&
            AllDataUser.map((dataUser, index) => {
              return (
                <React.Fragment key={index}>
                  <tr>
                    <th scope="row">{index + 1}</th>
                    <td>
                      {dataUser && dataUser.name
                        ? dataUser.name
                        : "Không có name"}
                    </td>
                    <td>{dataUser.username}</td>
                    <td>{dataUser.role}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-primary btn-featureHandle"
                        onClick={() =>
                          handleShowModalAdjustInformatione(dataUser.id)
                        }
                      >
                        <i className="fa-solid fa-wrench"></i>
                      </button>
                      &nbsp;
                      <button
                        type="button"
                        className="btn btn-danger btn-featureHandle"
                        onClick={() =>
                          handleShowModalConfirmDelete(dataUser.id)
                        }
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                </React.Fragment>
              );
            })}
          <Modal
            centered
            show={showModalConfirmDelete}
            onHide={handleCloseModalConfirmDelete}
          >
            <Modal.Body className="ConfirmDeleteModalBody">
              <h4>Xác nhận xóa người dùng này ?</h4>
              <div>
                <Button variant="danger" onClick={handleDeleteUser}>
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
              <Modal.Title>Chỉnh sửa thông tin người dùng</Modal.Title>
            </Modal.Header>
            <Modal.Body className="ProfileInformationModalBody">
              <Form onSubmit={handleSubmitChangeInform}>
                <Form.Group controlId="formName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="nameUser"
                    value={formValuesAdjustUser.nameUser}
                    onChange={handleChangeAdjustUser}
                    className="form-control"
                  />
                </Form.Group>

                <Form.Group controlId="formUsername">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    name="usernameUser"
                    value={formValuesAdjustUser.usernameUser}
                    onChange={handleChangeAdjustUser}
                    className="form-control"
                  />
                </Form.Group>

                <Form.Group controlId="formSelectRole">
                  <Form.Label>Role</Form.Label>
                  <Form.Control
                    as="select"
                    name="role"
                    value={formValuesAdjustUser.role}
                    onChange={handleChangeAdjustUser}
                    className={
                      error.role ? "form-control is-invalid" : "form-control"
                    }
                  >
                    <option value="">Select role</option>
                    <option value={"admin"}>Admin</option>
                    <option value={"user"}>User</option>
                  </Form.Control>
                  {error.role && (
                    <div
                      id="validationServerRoleFeedback"
                      className="invalid-feedback"
                    >
                      {error.role}
                    </div>
                  )}
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
          <Modal
            centered
            show={showModalCreateUser}
            onHide={handleCloseModalCreateUser}
          >
            <Modal.Header closeButton>
              <Modal.Title>Tạo mới người dùng</Modal.Title>
            </Modal.Header>
            <Modal.Body className="ProfileInformationModalBody">
              <Form onSubmit={handleSubmitCreateUser}>
                <Form.Group controlId="formUsername">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    value={formValuesCreateUser.username}
                    onChange={handleChangeCreateUser}
                    className={
                      error.username
                        ? "form-control is-invalid"
                        : "form-control"
                    }
                  />
                  {error.username && (
                    <div
                      id="validationServerUsernameFeedback"
                      className="invalid-feedback"
                    >
                      {error.username}
                    </div>
                  )}
                </Form.Group>

                <Form.Group controlId="formPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formValuesCreateUser.password}
                    onChange={handleChangeCreateUser}
                    className={
                      error.password
                        ? "form-control is-invalid"
                        : "form-control"
                    }
                  ></Form.Control>
                  {error.password && (
                    <div
                      id="validationServerUsernameFeedback"
                      className="invalid-feedback"
                    >
                      {error.password}
                    </div>
                  )}
                </Form.Group>

                <Form.Group controlId="formConfirmPassword">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="Cpassword"
                    value={formValuesCreateUser.Cpassword}
                    onChange={handleChangeCreateUser}
                    className={
                      error.Cpassword
                        ? "form-control is-invalid"
                        : "form-control"
                    }
                  ></Form.Control>
                  {error.Cpassword && (
                    <div
                      id="validationServerUsernameFeedback"
                      className="invalid-feedback"
                    >
                      {error.Cpassword}
                    </div>
                  )}
                </Form.Group>
                <Form.Group controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formValuesCreateUser.email}
                    onChange={handleChangeCreateUser}
                    className={
                      error.email ? "form-control is-invalid" : "form-control"
                    }
                  ></Form.Control>
                  {error.email && (
                    <div
                      id="validationServerUsernameFeedback"
                      className="invalid-feedback"
                    >
                      {error.email}
                    </div>
                  )}
                </Form.Group>
                <Form.Group controlId="formSelectRole">
                  <Form.Label>Role</Form.Label>
                  <Form.Control
                    as="select"
                    name="role"
                    value={formValuesCreateUser.role}
                    onChange={handleChangeCreateUser}
                    className={
                      error.role ? "form-control is-invalid" : "form-control"
                    }
                  >
                    <option value="">Select role</option>
                    <option value={"admin"}>Admin</option>
                    <option value={"user"}>User</option>
                  </Form.Control>
                  {error.role && (
                    <div
                      id="validationServerRoleFeedback"
                      className="invalid-feedback"
                    >
                      {error.role}
                    </div>
                  )}
                </Form.Group>
                <br />
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="primary"
                type="submit"
                onClick={handleSubmitCreateUser}
              >
                {loading ? "Submit..." : "Submit"}
              </Button>
            </Modal.Footer>
          </Modal>
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
    </div>
  );
}

export default Account;
