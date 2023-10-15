import axios from "axios";
import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import Validation from "../../validation/validation";
import { toast } from "sonner";

function Account() {
  const [showModalConfirmDelete, setShowModalConfirmDelete] = useState(false);
  const [showModalAdjustInformation, setShowModalAdjustInformation] = useState(false);
  const [showModalCreateUser, setShowModalCreateUser] = useState(false);
  const [IdUserDelete, setIdUserDelete] = useState(null);
  const [IdUserAdjust, setIdUserAdjust] = useState(null);
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
      const response = await axios.post(
        "http://localhost:8080/admin/adjustInformUser",
        {
          nameUser: formValuesAdjustUser.nameUser,
          usernameUser: formValuesAdjustUser.usernameUser,
          role: formValuesAdjustUser.role.trim(),
          idUser: IdUserAdjust,
        }
      );
      if (response.data.success) {
        toast.success(response.data.success);
      }
      fetchDataAllUser();
      setLoading(false);
      handleCloseModalAdjustInformation();
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.error);
      setLoading(false);
    }
  }
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
  const fetchDataAllUser = async () => {
    try {
      const response = await axios.get("http://localhost:8080/admin/getDataAllUser");
      setAllDataUser(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteUser = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8080/admin/deleteUser", {
        idUser: IdUserDelete,
      });
      fetchDataAllUser();
      toast.success(response.data.success);
      handleCloseModalConfirmDelete();
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  }
  const handleSubmitCreateUser = async (e) => {
    e.preventDefault();
    setError(Validation(formValuesCreateUser));
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:8080/admin/createNewUser",
        {
          username: formValuesCreateUser.username.trim(),
          password: formValuesCreateUser.password.trim(),
          Cpassword: formValuesCreateUser.Cpassword.trim(),
          email: formValuesCreateUser.email.trim(),
          role: formValuesCreateUser.role.trim(),
        }
      );
      console.log(response);
      if (response.data.success) {
        toast.success(response.data.success);
      }
      fetchDataAllUser();
      setLoading(false);
      handleCloseModalCreateUser();
    } catch (error) {
      toast.error(error.response.data.error);
      setLoading(false);
    }
  }
  const [AllDataUser, setAllDataUser] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/admin/getDataAllUser");
        setAllDataUser(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        Tài khoản
        <div style={{ marginRight: '50px' }}>
          <button className="btn btn-success" onClick={handleShowModalCreateUser}>
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
          {AllDataUser &&
            AllDataUser.map((dataUser, index) => {
              return (
                <>
                  <tr key={index}>
                    <th scope="row">{index + 1}</th>
                    <td>{dataUser && dataUser.name ? (dataUser.name) : "Không có name"}</td>
                    <td>{dataUser.username}</td>
                    <td>{dataUser.role}</td>
                    <td>
                      <button type="button" className="btn btn-primary" onClick={() => handleShowModalAdjustInformatione(dataUser.id)}>
                        Sửa
                      </button>
                      &nbsp;
                      <button type="button" className="btn btn-danger" onClick={() => handleShowModalConfirmDelete(dataUser.id)}>
                        Xóa
                      </button>
                    </td>
                  </tr>
                </>
              )
            })}
          <Modal
            centered
            show={showModalConfirmDelete}
            onHide={handleCloseModalConfirmDelete}
          >
            <Modal.Body className="ConfirmDeleteModalBody">
              <h4>Xác nhận xóa người dùng này ?</h4>
              <div>
                <Button
                  variant="danger"
                  onClick={handleDeleteUser}
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
                    className={error.role ? "form-control is-invalid" : "form-control"}
                  >
                    <option value="">Select role</option>
                    <option value={"admin"}>Admin</option>
                    <option value={"user"}>User</option>
                  </Form.Control>
                  {error.role && (
                    <div id="validationServerRoleFeedback" className="invalid-feedback">
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
                    className={error.password ? "form-control is-invalid" : "form-control"}
                  >
                  </Form.Control>
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
                    className={error.Cpassword ? "form-control is-invalid" : "form-control"}
                  >
                  </Form.Control>
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
                    className={error.email ? "form-control is-invalid" : "form-control"}
                  >
                  </Form.Control>
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
                    className={error.role ? "form-control is-invalid" : "form-control"}
                  >
                    <option value="">Select role</option>
                    <option value={"admin"}>Admin</option>
                    <option value={"user"}>User</option>
                  </Form.Control>
                  {error.role && (
                    <div id="validationServerRoleFeedback" className="invalid-feedback">
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
    </div>
  );
}

export default Account;
