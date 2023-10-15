import axios from "axios";
import moment from "moment";
import SettingsIcon from "@mui/icons-material/Settings";
import GridOnIcon from "@mui/icons-material/GridOn";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import FavoriteIcon from "@mui/icons-material/Favorite";
import InfiniteScroll from "react-infinite-scroll-component";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useCookies } from "react-cookie";
import Post from "../timeline/post/Post";
import Validation from "../../component/validation/validation";
import { toast } from "react-toastify";
import "./Profile.css";
import { Link, useParams } from "react-router-dom";

function Profile() {
  // id user khác
  const { userID } = useParams();
  const [postsData, setPostsData] = useState([]);

  // useEffect(() => {
  //   console.log("Khách: " + userID);
  // }, []);

  const [showModalAvatar, setShowModalAvatar] = useState(false);
  const [showModalInformationProfile, setShowModalInformationProfile] =
    useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [Images, setImages] = useState(null);
  const [hasAvatar, setHasAvatar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const [cookies] = useCookies(["session"]);
  const [formValues, setFormValues] = useState({
    name: "",
    moTa: "",
    birthday: "",
  });
  const [userData, setUserData] = useState("");
  // id account
  const id = userID ? userID : cookies.userId;
  const [CountPost, setCountPost] = useState(0);
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
      name: "",
      moTa: "",
      birthday: "",
    });
    setShowModalInformationProfile(true);
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
  const handleRemoveImage = async () => {
    setLoading(true);
    const imageUrl = userData.avatar;
    const url = new URL(imageUrl);
    const imagePath = url.pathname.substring("/uploads/".length);

    try {
      const response = await axios.post(
        "http://localhost:8080/account/removeAvatar",
        {
          id,
          imagePath,
        }
      );
      if (response.data.success) {
        setUserData((prevUserData) => ({
          ...prevUserData,
          avatar: "",
        }));
      }
      toast.success(response.data.success);
      handleCloseModalAvatar();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  const handleUploadImage = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("avatar", Images);
      formData.append("id", id);
      formData.append("hasAvatar", hasAvatar);

      const response = await axios.post(
        "http://localhost:8080/account/changeAvatar",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const newAvatar = response.data.avatar;
      setUserData((prevUserData) => ({
        ...prevUserData,
        avatar: newAvatar,
      }));
      toast.success(response.data.success);
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
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(Validation(formValues));
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:8080/account/UpdateInformationProfile",
        {
          name: formValues.name.trim(),
          moTa: formValues.moTa.trim(),
          date: moment(formValues.birthday).toISOString(),
          id: id,
        }
      );
      if (response.data.success) {
        toast.success(response.data.success);
      }
      setLoading(false);
      const nameUser = response.data.name;
      const moTaUser = response.data.moTa;
      setUserData((prevUserData) => ({
        ...prevUserData,
        name: nameUser,
        moTa: moTaUser,
      }));
      handleCloseModalInformationProfile();
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/account/getDataUser/${id}`
        ); // Thay đổi ID tùy theo người dùng muốn lấy dữ liệu
        setUserData(response.data[0]);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchData();
  }, [id]);
  useEffect(() => {
    if (userData.avatar) {
      const imageUrl = userData.avatar;
      const url = new URL(imageUrl);
      const imagePath = url.pathname.substring("/uploads/".length);
      if (imagePath) {
        setHasAvatar(imagePath);
      }
    }
  }, [userData]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/account/postProfileUser/${id}&1`
        ); // Thay đổi ID tùy theo người dùng muốn lấy dữ liệu
        /*  setUserData(response.data[0]); */
        setPostsData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchData();
  }, [id]);
  const [pageData, setpageData] = useState(2);
  useEffect(() => {
    const fetchDataCountPost = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:8080/account/countPost/${id}`
        );
        setCountPost(response.data[0].CountPosts);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    fetchDataCountPost();
  }, [id]);
  const fetchDataNew = () => {
    setpageData(pageData + 1);
    const dataNew = async () => {
      const response = await axios.get(
        `http://localhost:8080/account/postProfileUser/${id}&${pageData}`
      );
      if (response.status === 200) {
        const datas = response.data;
        setPostsData(postsData.concat(datas));
      } else {
        console.log("Lỗi rồi");
      }
    };
    dataNew();
  };
  return (
    <>
      <div className="container-fluid" style={{ overflowX: "hidden" }}>
        <div className="container containerProfile">
          <header className="ProfileHeader">
            <div
              className="row"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div className="col-md-3" style={{ padding: 0, marginRight: 30 }}>
                <div className="Profile_Avatar">
                  <div className="Profile_Avatar_Content">
                    <Button
                      className="ChangeAvatar"
                      variant="primary"
                      onClick={!userID ? handleShowModalAvatar : undefined}
                      title="ChangeAvatar"
                    >
                      {loading ? (
                        <div>Loading....</div>
                      ) : userData && !userData.avatar ? (
                        <img
                          className="ProfileAvatarImg"
                          src="https://i.pinimg.com/564x/64/b9/dd/64b9dddabbcf4b5fb2b885927b7ede61.jpg"
                          alt="Avatar"
                        />
                      ) : (
                        <img
                          className="ProfileAvatarImg"
                          src={userData.avatar}
                          alt="Avatar"
                        />
                      )}
                    </Button>
                    <Modal
                      show={showModalAvatar}
                      onHide={handleCloseModalAvatar}
                    >
                      <Modal.Header closeButton>
                        <Modal.Title>Thay đổi ảnh đại diện</Modal.Title>
                      </Modal.Header>
                      <Modal.Body className="ProfileAvatarModalBody">
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
                        <Form encType="multipart/form-data">
                          <Form.Group>
                            <Form.Label
                              className="HandleButtonProfile ProfileUploadColor"
                              htmlFor="ProfileUploadFile"
                            >
                              Tải ảnh đại diện
                            </Form.Label>
                            <Form.Control
                              type="file"
                              name="avatar"
                              accept="image/*"
                              id="ProfileUploadFile"
                              onChange={handleInputChange}
                              required
                            />
                          </Form.Group>
                        </Form>
                        {userData.avatar ? (
                          <label
                            className="HandleButtonProfile ProfileRemoveColor"
                            onClick={handleRemoveImage}
                          >
                            {loading ? "Remove..." : "Xóa ảnh đại diện"}
                          </label>
                        ) : (
                          <div></div>
                        )}
                      </Modal.Body>
                      <Modal.Footer>
                        <Button
                          variant="secondary"
                          onClick={handleCloseModalAvatar}
                        >
                          Close
                        </Button>
                        <Button
                          variant="primary"
                          disabled={!selectedImage || loading}
                          onClick={handleUploadImage}
                        >
                          {loading ? "Uploading..." : "Upload Avatar"}
                        </Button>
                      </Modal.Footer>
                    </Modal>
                  </div>
                </div>
              </div>
              <div className="col-md-8">
                <div className="ProfileRow">
                  <p className="ProfileTitle">
                    {userData.name ? userData.name : userData.username}
                  </p>
                  <div className="ProfileLinkContainer">
                    {!userID && (
                      <button
                        className="ProfileLinkButton"
                        onClick={handleShowModalInformationProfile}
                      >
                        <a href="#" className="ProfileLink">
                          Chỉnh sửa trang cá nhân
                        </a>
                      </button>
                    )}
                    <Modal
                      centered
                      show={showModalInformationProfile}
                      onHide={handleCloseModalInformationProfile}
                    >
                      <Modal.Header closeButton>
                        <Modal.Title>Chỉnh sửa thông tin cá nhân</Modal.Title>
                      </Modal.Header>
                      <Modal.Body className="ProfileInformationModalBody">
                        <Form onSubmit={handleSubmit}>
                          <Form.Group controlId="formName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                              type="text"
                              name="name"
                              value={formValues.name}
                              onChange={handleChange}
                              className={
                                error.name
                                  ? "form-control is-invalid"
                                  : "form-control"
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
                                error.moTa
                                  ? "form-control is-invalid"
                                  : "form-control"
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
                                error.birthday
                                  ? "form-control is-invalid"
                                  : "form-control"
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
                        </Form>
                      </Modal.Body>
                      <Modal.Footer>
                        <Button
                          variant="primary"
                          type="submit"
                          onClick={handleSubmit}
                        >
                          {loading ? "Submit..." : "Submit"}
                        </Button>
                      </Modal.Footer>
                    </Modal>
                  </div>
                  <div className="ProfileSettingIcon">
                    <SettingsIcon />
                  </div>
                </div>
                <div className="ProfileRow">
                  <div>
                    <span>
                      <b>{CountPost}</b> bài viết
                    </span>
                    <span>
                      <a href="#">
                        Có <b>12</b> bạn bè
                      </a>
                    </span>
                    {/* userID */}
                    <span>
                      <Link to={`/home/messenger/${userID}`}>Nhắn tin</Link>
                    </span>
                  </div>
                </div>
                <div className="ProfileRow">
                  <p>{userData.moTa}</p>
                </div>
              </div>
            </div>
          </header>
          <div className="container containerFeature">
            <div className="row justify-content-center align-items-center">
              <div className="col-md-3 ColumnProfileFeature">
                <a>
                  <GridOnIcon />
                  <span>bài viết</span>
                </a>
              </div>
              {/*   <div className="col-md-3 ColumnProfileFeature">
                <a>
                  <BookmarkIcon />
                  <span>đã lưu</span>
                </a>
              </div> */}
            </div>
          </div>
          {postsData.length > 0 ? (
            postsData.map((data, index) => {
              return (
                <>
                  <div className="container ProfilePostContent" key={index}>
                    <Post
                      key={index}
                      id={data.id}
                      userid={data.userid}
                      user={data.username}
                      name={data.name}
                      time={data.created_at}
                      avatar={data.avatar}
                      title={data.content}
                      // like={100}
                    />
                  </div>
                </>
              );
            })
          ) : (
            <div className="container NotificationPostGroup">
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <span>Không có bài viết nào</span>
                <i className="fa-regular fa-face-frown"></i>
              </div>
            </div>
          )}
        </div>
        <InfiniteScroll
          dataLength={postsData.length + 1}
          next={fetchDataNew}
          hasMore={true}
          // loader={<h4>Loading...</h4>}
        ></InfiniteScroll>
      </div>
    </>
  );
}

export default Profile;
