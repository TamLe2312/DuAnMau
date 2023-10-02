import axios from "axios";
import moment from 'moment';
import SettingsIcon from '@mui/icons-material/Settings';
import GridOnIcon from '@mui/icons-material/GridOn';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useCookies } from "react-cookie";
import Validation from "../../component/validation/validation";
import "./Profile.css"

function Profile() {

  const [showModalAvatar, setShowModalAvatar] = useState(false);
  const [showModalInformationProfile, setShowModalInformationProfile] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const [cookies] = useCookies(["session"]);
  /* const [uploadedFile, setUploadedFile] = useState({}); */
  const [isHaveAvatar, setIsHaveAvatar] = useState(true);
  const [formValues, setFormValues] = useState({
    name: '',
    moTa: '',
    birthday: ''
  });
  const [userData, setUserData] = useState("");
  const id = cookies.userId;

  const handleCloseModalAvatar = () => {
    setSelectedImage(null);
    setShowModalAvatar(false);
  };

  const handleShowModalAvatar = () => {
    setShowModalAvatar(true);
  };
  const handleCloseModalInformationProfile = () => {
    setShowModalInformationProfile(false);
  };

  const handleShowModalInformationProfile = () => {
    setFormValues({
      name: '',
      moTa: '',
      birthday: ''
    })
    setShowModalInformationProfile(true);
  };

  const handleInputChange = (event) => {
    setSelectedImage(event.target.files[0]);
  };

  const handleUploadImage = async () => {
    setLoading(true);
    try {
      /* const formData = new FormData();
      formData.append("avatar", selectedImage);

      // Gửi yêu cầu POST để tải lên file ảnh
      const response = await axios.post("http://localhost:8080/account/changeAvatar", formData);

      const imageURL = response.data.imageURL;
      
      console.log(imageURL) */
      /* const { fileName, filePath } = response.data;
      setUploadedFile({ fileName, filePath });
      console.log(uploadedFile); */
      handleCloseModalAvatar();
      setLoading(false);

    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(Validation(formValues));
    try {
      setLoading(true);
      const response = await axios.post("http://localhost:8080/account/UpdateInformationProfile", {
        name: formValues.name.trim(),
        moTa: formValues.moTa.trim(),
        date: moment(formValues.birthday).toISOString(),
        id: id,
      });
      setLoading(false);
      setUserData(JSON.parse(response.config.data));
      handleCloseModalInformationProfile();
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/account/getDataUser/${id}`); // Thay đổi ID tùy theo người dùng muốn lấy dữ liệu
        setUserData(response.data[0]);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchData();
  }, [id]);

  return (
    <>
      <div className="container-fluid">
        <div className="container containerProfile">
          <header className="ProfileHeader">
            <div className="row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div className="col-md-3" style={{ padding: 0, marginRight: 30 }}>
                <div className="Profile_Avatar">
                  <div className="Profile_Avatar_Content">
                    <Button className='ChangeAvatar' variant="primary" onClick={handleShowModalAvatar} title='ChangeAvatar'>
                      {selectedImage ? (
                        <img className="ProfileAvatarImg" src={URL.createObjectURL(selectedImage)} alt="Avatar" />
                      ) : (
                        <img className="ProfileAvatarImg" src="https://i.pinimg.com/564x/64/b9/dd/64b9dddabbcf4b5fb2b885927b7ede61.jpg" alt="Avatar" />
                      )}
                    </Button>
                    <Modal show={showModalAvatar} onHide={handleCloseModalAvatar}>
                      <Modal.Header closeButton>
                        <Modal.Title>Thay đổi ảnh đại diện</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <div className="ShowImageContainer">
                          {selectedImage ? (
                            <img className="ShowImageWhenUpload" src={URL.createObjectURL(selectedImage)} alt="Avatar" />)
                            : (<div></div>)
                          }
                        </div>
                        <Form>
                          <Form.Group controlId="avatar">
                            <Form.Label>Tải ảnh đại diện</Form.Label>
                            <Form.Control
                              type="file"
                              name="avatar"
                              accept="image/*"
                              onChange={handleInputChange}
                              required
                            />
                          </Form.Group>
                        </Form>
                      </Modal.Body>
                      <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModalAvatar}>
                          Close
                        </Button>
                        {!isHaveAvatar ? (
                          <Button variant="danger" disabled={selectedImage || loading} onClick={handleUploadImage}>
                            {loading ? "Remove..." : "Remove Image"}
                          </Button>
                        ) : (
                          <div></div>
                        )
                        }
                        <Button variant="primary" disabled={!selectedImage || loading} onClick={handleUploadImage}>
                          {loading ? "Uploading..." : "Upload Image"}
                        </Button>
                      </Modal.Footer>
                    </Modal>
                  </div>
                </div>
              </div>
              <div className="col-md-8">
                <div className="ProfileRow">
                  <p className="ProfileTitle">
                    {userData.name ? (
                      userData.name
                    ) :
                      (
                        userData.username
                      )}
                  </p>
                  <div className="ProfileLinkContainer">
                    <button className="ProfileLinkButton" onClick={handleShowModalInformationProfile}>
                      <a href="#" className="ProfileLink">
                        Chỉnh sửa trang cá nhân
                      </a>
                    </button>
                    <Modal centered show={showModalInformationProfile} onHide={handleCloseModalInformationProfile}>
                      <Modal.Header closeButton>
                        <Modal.Title>Chỉnh sửa thông tin cá nhân</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <Form onSubmit={handleSubmit}>
                          <Form.Group controlId="formName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                              type="text"
                              name="name"
                              value={formValues.name}
                              onChange={handleChange}
                              className={
                                error.name ? "form-control is-invalid" : "form-control"
                              }
                            />
                            {error.name && (
                              <div
                                id="validationServerUsernameFeedback"
                                className="invalid-feedback"
                              >
                                {error.name}
                              </div>
                            )}
                          </Form.Group>

                          <Form.Group controlId="formDescription">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                              as="textarea"
                              name="moTa"
                              value={formValues.moTa}
                              onChange={handleChange}
                              className={
                                error.moTa ? "form-control is-invalid" : "form-control"
                              }
                            />
                            {error.moTa && (
                              <div
                                id="validationServerUsernameFeedback"
                                className="invalid-feedback"
                              >
                                {error.moTa}
                              </div>
                            )}
                          </Form.Group>

                          <Form.Group controlId="formBirthday">
                            <Form.Label>Birthday</Form.Label>
                            <Form.Control
                              type="date"
                              name="birthday"
                              value={formValues.birthday}
                              onChange={handleChange}
                              className={
                                error.birthday ? "form-control is-invalid" : "form-control"
                              }
                            />
                            {error.birthday && (
                              <div
                                id="validationServerUsernameFeedback"
                                className="invalid-feedback"
                              >
                                {error.birthday}
                              </div>
                            )}
                          </Form.Group>
                          <br />
                          <Modal.Footer>
                            <Button variant="primary" type="submit" onClick={handleSubmit}>
                              {loading ? "Submit..." : "Submit"}
                            </Button>
                          </Modal.Footer>
                        </Form>
                      </Modal.Body>
                    </Modal>
                  </div>
                  <div className='ProfileSettingIcon'>
                    <SettingsIcon />
                  </div>
                </div>
                <div className="ProfileRow">
                  <div>
                    <span>0 bài viết</span>
                    <span>
                      <a href='#'>Có <b>12</b> bạn bè</a>
                    </span>
                  </div>
                </div>
                <div className="ProfileRow">
                  <p >
                    {userData.moTa}
                  </p>
                </div>
              </div>

            </div>
          </header>
          <div className="container containerFeature">
            <div className="row justify-content-center align-items-center">
              <div className="col-md-3 ColumnProfileFeature">
                <a>
                  <GridOnIcon />
                  <span>
                    bài viết
                  </span>
                </a>
              </div>
              <div className="col-md-3 ColumnProfileFeature">
                <a>
                  <BookmarkIcon />
                  <span>đã lưu</span>
                </a>
              </div>
            </div>
          </div>
        </div >
      </div >
    </>
  );
}

export default Profile;
