import moment from "moment";
import SettingsIcon from "@mui/icons-material/Settings";
import GridOnIcon from "@mui/icons-material/GridOn";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import FavoriteIcon from "@mui/icons-material/Favorite";
import SearchIcon from "@mui/icons-material/Search";
import InfiniteScroll from "react-infinite-scroll-component";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect, useRef } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useCookies } from "react-cookie";
import Post from "../timeline/post/Post";
import Validation from "../../component/validation/validation";
import { toast } from "sonner";
import "./Profile.css";
import { Link, useParams } from "react-router-dom";
import * as request from "../../utils/request";

function Profile() {
  // id user khác
  const { userID } = useParams();
  const [postsData, setPostsData] = useState([]);
  const refSearch = useRef();
  const [showModalAvatar, setShowModalAvatar] = useState(false);
  const [showModalFollower, setShowModalFollower] = useState(false);
  const [showModalFollowed, setShowModalFollowed] = useState(false);
  const [showModalInformationProfile, setShowModalInformationProfile] =
    useState(false);
  const [hasAvatar, setHasAvatar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const [cookies] = useCookies(["session"]);
  const [formValues, setFormValues] = useState({
    name: "",
    moTa: "",
    birthday: "",
  });
  const [isHaveInform, setIsHaveInform] = useState(false);
  const [searchValueFollower, setSearchValueFollower] = useState("");
  const [searchValueFollowed, setSearchValueFollowed] = useState("");
  const [userData, setUserData] = useState("");
  const [followerData, setFollowerData] = useState([]);
  const [followedData, setFollowedData] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const handleClickShowMore = () => {
    setShowMore(!showMore);
  };
  // id account
  const id = userID ? userID : cookies.userId;
  const [CountPost, setCountPost] = useState(0);
  const handleCloseModalAvatar = () => {
    setShowModalAvatar(false);
  };
  const handleShowModalAvatar = () => {
    setShowModalAvatar(true);
  };
  const handleCloseModalFollower = () => {
    /* setSearchValue((preSearchValue) => ({
      ...preSearchValue,
      searchUser: "",
    })); */
    setSearchValueFollower("");
    setSearchUserFollower([]);
    setShowModalFollower(false);
  };
  const handleShowModalFollower = () => {
    setShowModalFollower(true);
  };
  const handleCloseModalFollowed = () => {
    setSearchValueFollowed("");
    setSearchUserFollowed([]);
    setShowModalFollowed(false);
  };
  const handleShowModalFollowed = () => {
    setShowModalFollowed(true);
  };
  const handleCloseModalInformationProfile = () => {
    setIsHaveInform(false);
    setShowModalInformationProfile(false);
  };
  const [searchUserFollower, setSearchUserFollower] = useState([]);
  const [searchUserFollowed, setSearchUserFollowed] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await request.post("account/searchUserFollower", {
          searchUser: searchValueFollower,
          idUser: id,
        });
        if (response.data.length === 0) {
          setSearchUserFollower([]);
        } else {
          setSearchUserFollower(response.data);
        }
      } catch (err) {
        setSearchUserFollower([]);
        console.error(err);
      }
    };
    if (searchValueFollower) {
      fetchData();
    } else {
      setSearchUserFollower([]);
    }
  }, [searchValueFollower, id]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await request.post("account/searchUserFollowed", {
          searchFollowed: searchValueFollowed,
          idUser: id,
        });
        if (response.data.length === 0) {
          setSearchUserFollower([]);
        } else {
          const updatedData = response.data.map((item) => {
            return { ...item, isFollow: true };
          });
          setSearchUserFollowed(updatedData);
        }
      } catch (err) {
        console.error(err);
        setSearchUserFollowed([]);
      }
    };
    if (searchValueFollowed) {
      fetchData();
    } else {
      setSearchUserFollowed([]);
    }
  }, [searchValueFollowed, id]);
  /*  const handleKeyEnterSearchFollower = async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      try {
        const response = await request.post("account/searchUserFollower", {
          searchUser: searchValue,
          idUser: id,
        });
        setSearchUserFollower(response.data);
      } catch (err) {
        console.error(err);
        toast.error(err.response.data.error);
      }
    }
    if (e.key === "Backspace" || e.key === "Delete") {
      setSearchUserFollower([]);
    }
  }; */
  /* const handleKeyEnterSearchFollowed = async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      try {
        const response = await request.post("account/searchUserFollowed", {
          searchFollowed: searchValueFollowed,
          idUser: id,
        });
        const updatedData = response.data.map((item) => {
          return { ...item, isFollow: true };
        });
        setSearchUserFollowed(updatedData);
      } catch (err) {
        console.error(err);
        toast.error(err.response.data.error);
      }
    }
    if (e.key === "Backspace" || e.key === "Delete") {
      setSearchUserFollowed([]);
    }
  }; */
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
    handleUploadImage(selectedFile);
    handleCloseModalAvatar();
  };
  const handleRemoveImage = async () => {
    setLoading(true);
    const imageUrl = userData.avatar;
    const url = new URL(imageUrl);
    const imagePath = url.pathname.substring("/uploads/".length);

    try {
      const response = await request.post("account/removeAvatar", {
        id,
        imagePath,
      });
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

  const handleUploadImage = async (selectedFile) => {
    try {
      const formData = new FormData();
      formData.append("avatar", selectedFile);
      formData.append("id", id);
      formData.append("hasAvatar", hasAvatar);

      const response = await request.post("account/changeAvatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const newAvatar = response.data.avatar;
      setUserData((prevUserData) => ({
        ...prevUserData,
        avatar: newAvatar,
      }));
      toast.success(response.data.success);
      handleCloseModalAvatar();
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
    if (e.target.value !== "") {
      setIsHaveInform(true);
    } else {
      setIsHaveInform(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(Validation(formValues));
    const currentDateTime = moment().toISOString();
    const selectedDateTime = moment(formValues.birthday).toISOString();
    if (moment(selectedDateTime).isAfter(currentDateTime)) {
      toast.error("Ngày sinh không thể ở tương lai.");
      return;
    }
    try {
      setLoading(true);
      const response = await request.post("account/UpdateInformationProfile", {
        name: formValues.name,
        moTa: formValues.moTa,
        date: moment(formValues.birthday).toISOString(),
        id: id,
      });
      if (response.data.success) {
        toast.success(response.data.success);
      }
      setLoading(false);
      const nameUser = response.data.name;
      const moTaUser = response.data.moTa;
      const usernameU = response.data.username;
      setUserData((prevUserData) => ({
        ...prevUserData,
        name: nameUser,
        moTa: moTaUser,
        username: usernameU,
      }));
      handleCloseModalInformationProfile();
    } catch (error) {
      toast.error(error.response.data.error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await request.get(`account/getDataUser/${id}`);
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
        const response = await request.get(`account/followerData/${id}&1`);
        setFollowerData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchData();
  }, [id]);
  useEffect(() => {
    const fetchData = async () => {
      if (id === cookies.userId) {
        try {
          const response = await request.get(`account/followedData/${id}&1`);
          const updatedData = response.data.map((item) => {
            return { ...item, isFollow: true };
          });
          setFollowedData(updatedData);
        } catch (error) {
          setFollowedData([]);
        }
      } else {
        try {
          const response = await request.get(`account/followedData/${id}&1`);
          const updatedData = response.data.map((item) => {
            if (item.id === cookies.userId) {
              return { ...item, isFollowme: true };
            } else {
              return { ...item, isFollow: true };
            }
          });

          setFollowedData(updatedData);
        } catch (error) {
          setFollowedData([]);
        }
      }
    };
    fetchData();
  }, [id]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await request.get(`account/postProfileUser/${id}&1`); // Thay đổi ID tùy theo người dùng muốn lấy dữ liệu
        /*  setUserData(response.data[0]); */
        setPostsData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchData();
  }, [id]);
  const [pageData, setpageData] = useState(2);
  const [isMoreDetailFollower, setIsMoreDetailFollower] = useState(false);
  const [isMoreDetailFollowed, setIsMoreDetailFollowed] = useState(false);
  const handleMoreDetailFollower = async () => {
    try {
      const response = await request.get(`account/followerData/${id}&0`);
      setFollowerData(response.data);
      setIsMoreDetailFollower(true);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  const handleMoreDetailFollowed = async () => {
    try {
      const response = await request.get(`account/followedData/${id}&0`);
      const updatedData = response.data.map((item) => {
        return { ...item, isFollow: true };
      });
      setFollowedData(updatedData);
      setIsMoreDetailFollowed(true);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  const handleAdd = async (idFollowed) => {
    if (id === cookies.userId) {
      try {
        let res = await request.post("account/followUser", {
          follower_id: id,
          followed_id: idFollowed,
        });
        if (res.data.success) {
          toast.success(res.data.success);
          if (searchUserFollowed && searchUserFollowed.length > 0) {
            setSearchUserFollowed((prevData) =>
              prevData.map((data) =>
                data.id === idFollowed ? { ...data, isFollow: true } : data
              )
            );
          }
          setFollowedData((prevData) =>
            prevData.map((data) =>
              data.id === idFollowed ? { ...data, isFollow: true } : data
            )
          );
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleRemove = async (idFollowed) => {
    if (id === cookies.userId) {
      try {
        let res = await request.post("account/unfollowUser", {
          follower_id: id,
          followed_id: idFollowed,
        });
        if (res.data.success) {
          toast.success(res.data.success);
          if (searchUserFollowed && searchUserFollowed.length > 0) {
            setSearchUserFollowed((prevData) =>
              prevData.map((data) =>
                data.id === idFollowed ? { ...data, isFollow: false } : data
              )
            );
          }
          setFollowedData((prevData) =>
            prevData.map((data) =>
              data.id === idFollowed ? { ...data, isFollow: false } : data
            )
          );
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        let res = await request.post("account/unfollowUser", {
          follower_id: cookies.userId,
          followed_id: idFollowed,
        });
        if (res.data.success) {
          toast.success(res.data.success);
          if (searchUserFollowed && searchUserFollowed.length > 0) {
            setSearchUserFollowed((prevData) =>
              prevData.map((data) =>
                data.id === idFollowed ? { ...data, isFollow: false } : data
              )
            );
          }
          setFollowedData((prevData) =>
            prevData.map((data) =>
              data.id === idFollowed ? { ...data, isFollow: false } : data
            )
          );
        }
      } catch (error) {
        console.error(error);
      }
    }
  };
  useEffect(() => {
    setFollowerData(followerData);
  }, [followerData]);
  const fetchDataNew = () => {
    setpageData(pageData + 1);
    const dataNew = async () => {
      const response = await request.get(
        `account/postProfileUser/${id}&${pageData}`
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
  useEffect(() => {
    const fetchDataCountPost = async () => {
      setLoading(true);
      try {
        const response = await request.get(`account/countPost/${id}`);
        setCountPost(response.data[0].CountPosts);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    fetchDataCountPost();
  }, [id]);
  const [totalFollower, setTotalFollower] = useState(0);
  const [totalFollowed, setTotalFollowed] = useState(0);
  useEffect(() => {
    const fetchDataCountFollow = async () => {
      setLoading(true);
      try {
        const response = await request.get(`account/countFollow/${id}`);
        setTotalFollower(response.data[0].followerCount);
        setTotalFollowed(response.data[0].followingCount);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    fetchDataCountFollow();
  }, [id]);
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
                      {/*   <Modal.Header closeButton>
                        <Modal.Title>Thay đổi ảnh đại diện</Modal.Title>
                      </Modal.Header> */}
                      <Modal.Body className="ProfileAvatarModalBody">
                        <div className="ProfileTitleChangeAvatar">
                          <span>Thay đổi ảnh đại diện</span>
                        </div>
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
                        <div className="ProfileButtonHandleClose">
                          <Button
                            variant="secondary"
                            onClick={handleCloseModalAvatar}
                          >
                            Close
                          </Button>
                        </div>
                      </Modal.Body>
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
                              className="form-control"
                            />
                          </Form.Group>
                          <Form.Group controlId="formDescription">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                              as="textarea"
                              name="moTa"
                              value={formValues.moTa}
                              onChange={handleChange}
                              className="form-control"
                            />
                          </Form.Group>
                          <Form.Group controlId="formBirthday">
                            <Form.Label>Birthday</Form.Label>
                            <Form.Control
                              type="date"
                              name="birthday"
                              value={formValues.birthday}
                              onChange={handleChange}
                              className="form-control"
                            />
                          </Form.Group>
                          <br />
                        </Form>
                      </Modal.Body>
                      <Modal.Footer>
                        {isHaveInform ? (
                          <Button
                            variant="primary"
                            type="submit"
                            onClick={handleSubmit}
                          >
                            {loading ? "Submit..." : "Submit"}
                          </Button>
                        ) : (
                          <Button variant="secondary" type="submit">
                            {loading ? "Submit..." : "Submit"}
                          </Button>
                        )}
                      </Modal.Footer>
                    </Modal>
                  </div>
                  {/* <div className="ProfileSettingIcon">
                    <SettingsIcon />
                  </div> */}
                </div>
                <div className="ProfileRow">
                  <div>
                    <span style={{ marginRight: 20 }}>
                      <b>{CountPost}</b> bài viết
                    </span>
                    <span className="ProfileFollowButtonLink">
                      <a onClick={handleShowModalFollower}>
                        Có <b>{totalFollower ? totalFollower : 0}</b> người theo
                        dõi
                      </a>
                    </span>
                    <Modal
                      centered
                      show={showModalFollower}
                      onHide={handleCloseModalFollower}
                    >
                      <Modal.Header closeButton>
                        <Modal.Title>Người theo dõi</Modal.Title>
                      </Modal.Header>
                      <Modal.Body className="CreateGroupModalBody">
                        <Form>
                          <Form.Group
                            className="mb-3"
                            controlId="exampleForm.ControlInput1"
                            style={{ position: "relative" }}
                          >
                            <Form.Control
                              ref={refSearch}
                              type="text"
                              placeholder="Nhập tên follower cần tìm..."
                              name="searchFollower"
                              onChange={(e) =>
                                setSearchValueFollower(e.target.value)
                              }
                            />
                            <SearchIcon
                              style={{
                                position: "absolute",
                                right: "10px",
                                top: "50%",
                                transform: "translateY(-50%)",
                              }}
                            />
                          </Form.Group>
                        </Form>
                        <div className="ProfileFollowerHeader">
                          <span>Người theo dõi</span>
                          <span>
                            <Link to={`/home/suggestFollow`}>Gợi ý</Link>
                          </span>
                        </div>
                        <div className="ProfileFollowerContainer">
                          <div
                            style={{ height: "auto", overflow: "hidden auto" }}
                          >
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                paddingBottom: 0,
                                paddingTop: 0,
                                position: "relative",
                              }}
                            >
                              {searchUserFollower &&
                              searchUserFollower.length > 0 &&
                              followerData ? (
                                searchUserFollower &&
                                searchUserFollower.length !== 0 ? (
                                  searchUserFollower.map(
                                    (dataSearch, index) => {
                                      return (
                                        <>
                                          <div
                                            className="ProfileFollowRowContent"
                                            key={index}
                                          >
                                            <div className="ProfileFollowImgContent">
                                              {dataSearch.avatar ? (
                                                <>
                                                  <Link
                                                    to={`/home/profile/user/${dataSearch.id}`}
                                                    className="suggestionFriend-title-link"
                                                  >
                                                    <img
                                                      src={dataSearch.avatar}
                                                    />
                                                  </Link>
                                                </>
                                              ) : (
                                                <>
                                                  <Link
                                                    to={`/home/profile/user/${dataSearch.id}`}
                                                    className="ProfileFollowLink"
                                                    onClick={
                                                      handleCloseModalFollower
                                                    }
                                                  >
                                                    <img src="https://i.pinimg.com/564x/64/b9/dd/64b9dddabbcf4b5fb2b885927b7ede61.jpg" />
                                                  </Link>
                                                </>
                                              )}
                                            </div>
                                            <span>
                                              <Link
                                                to={`/home/profile/user/${dataSearch.id}`}
                                                className="ProfileFollowLink"
                                                onClick={
                                                  handleCloseModalFollower
                                                }
                                              >
                                                {dataSearch.name
                                                  ? dataSearch.name
                                                  : dataSearch.username}
                                              </Link>
                                            </span>
                                          </div>
                                        </>
                                      );
                                    }
                                  )
                                ) : (
                                  <div className="ProfileFollowRowContent">
                                    <span>Không có ai theo dõi</span>
                                  </div>
                                )
                              ) : followerData && followerData.length > 0 ? (
                                followerData.map((dataFollower, index) => {
                                  return (
                                    <>
                                      <div
                                        className="ProfileFollowRowContent"
                                        key={index}
                                      >
                                        <div className="ProfileFollowImgContent">
                                          {dataFollower.avatar ? (
                                            <>
                                              <Link
                                                to={`/home/profile/user/${dataFollower.id}`}
                                                className="suggestionFriend-title-link"
                                              >
                                                <img
                                                  src={dataFollower.avatar}
                                                />
                                              </Link>
                                            </>
                                          ) : (
                                            <>
                                              <Link
                                                to={`/home/profile/user/${dataFollower.id}`}
                                                className="ProfileFollowLink"
                                                onClick={
                                                  handleCloseModalFollower
                                                }
                                              >
                                                <img src="https://i.pinimg.com/564x/64/b9/dd/64b9dddabbcf4b5fb2b885927b7ede61.jpg" />
                                              </Link>
                                            </>
                                          )}
                                        </div>
                                        <span>
                                          <Link
                                            to={`/home/profile/user/${dataFollower.id}`}
                                            className="ProfileFollowLink"
                                            onClick={handleCloseModalFollower}
                                          >
                                            {dataFollower.name
                                              ? dataFollower.name
                                              : dataFollower.username}
                                          </Link>
                                        </span>
                                      </div>
                                    </>
                                  );
                                })
                              ) : (
                                <div className="ProfileFollowRowContent">
                                  <span>Không có ai theo dõi</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        {searchUserFollower && searchUserFollower.length > 0 ? (
                          <></>
                        ) : followerData &&
                          followerData.length > 0 &&
                          followerData.length < 5 ? (
                          <></>
                        ) : (
                          !isMoreDetailFollower && (
                            <div
                              className="ProfileFollowButtonMoreDetail"
                              onClick={handleMoreDetailFollower}
                            >
                              <button>Xem thêm</button>
                            </div>
                          )
                        )}
                      </Modal.Body>
                    </Modal>
                    <span className="ProfileFollowButtonLink">
                      <a onClick={handleShowModalFollowed}>
                        Đang theo dõi <b>{totalFollowed ? totalFollowed : 0}</b>{" "}
                        người
                      </a>
                    </span>
                    <Modal
                      centered
                      show={showModalFollowed}
                      onHide={handleCloseModalFollowed}
                    >
                      <Modal.Header closeButton>
                        <Modal.Title>Người đang theo dõi</Modal.Title>
                      </Modal.Header>
                      <Modal.Body className="CreateGroupModalBody">
                        <Form>
                          <Form.Group
                            className="mb-3"
                            controlId="exampleForm.ControlInput1"
                            style={{ position: "relative" }}
                          >
                            <Form.Control
                              ref={refSearch}
                              type="text"
                              placeholder="Nhập tên người đang theo dõi cần tìm..."
                              name="searchFollowed"
                              onChange={(e) =>
                                setSearchValueFollowed(e.target.value)
                              }
                            />
                            <SearchIcon
                              style={{
                                position: "absolute",
                                right: "10px",
                                top: "50%",
                                transform: "translateY(-50%)",
                              }}
                            />
                          </Form.Group>
                        </Form>
                        <div className="ProfileFollowerHeader">
                          <span>Người đang theo dõi</span>
                          <span>
                            <Link to={`/home/suggestFollow`}>Gợi ý</Link>
                          </span>
                        </div>
                        <div className="ProfileFollowerContainer">
                          <div
                            style={{ height: "auto", overflow: "hidden auto" }}
                          >
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                paddingBottom: 0,
                                paddingTop: 0,
                                position: "relative",
                              }}
                            >
                              {searchUserFollowed &&
                              searchUserFollowed.length > 0 ? (
                                searchUserFollowed &&
                                searchUserFollowed.length > 0 ? (
                                  searchUserFollowed.map(
                                    (searchUserFollowed, index) => {
                                      return (
                                        <>
                                          <div
                                            className="ProfileFollowRowContent"
                                            key={index}
                                          >
                                            <div className="ProfileFollowImgContent">
                                              {searchUserFollowed.avatar ? (
                                                <>
                                                  <Link
                                                    to={`/home/profile/user/${searchUserFollowed.id}`}
                                                    className="suggestionFriend-title-link"
                                                  >
                                                    <img
                                                      src={
                                                        searchUserFollowed.avatar
                                                      }
                                                    />
                                                  </Link>
                                                </>
                                              ) : (
                                                <>
                                                  <Link
                                                    to={`/home/profile/user/${searchUserFollowed.id}`}
                                                    className="ProfileFollowLink"
                                                    onClick={
                                                      handleCloseModalFollowed
                                                    }
                                                  >
                                                    <img src="https://i.pinimg.com/564x/64/b9/dd/64b9dddabbcf4b5fb2b885927b7ede61.jpg" />
                                                  </Link>
                                                </>
                                              )}
                                            </div>
                                            <span>
                                              <Link
                                                to={`/home/profile/user/${searchUserFollowed.id}`}
                                                className="ProfileFollowLink"
                                                onClick={
                                                  handleCloseModalFollowed
                                                }
                                              >
                                                {searchUserFollowed.name
                                                  ? searchUserFollowed.name
                                                  : searchUserFollowed.username}
                                              </Link>
                                            </span>
                                            {searchUserFollowed.isFollow ? (
                                              <button
                                                onClick={() =>
                                                  handleRemove(
                                                    searchUserFollowed.id
                                                  )
                                                }
                                              >
                                                Unfollow
                                              </button>
                                            ) : (
                                              <button
                                                onClick={() =>
                                                  handleAdd(
                                                    searchUserFollowed.id
                                                  )
                                                }
                                              >
                                                Follow
                                              </button>
                                            )}
                                          </div>
                                        </>
                                      );
                                    }
                                  )
                                ) : (
                                  <div className="ProfileFollowRowContent">
                                    <span>Không có ai theo dõi</span>
                                  </div>
                                )
                              ) : followedData && followedData.length > 0 ? (
                                followedData.map((followedData, index) => {
                                  return (
                                    <>
                                      <div
                                        className="ProfileFollowRowContent"
                                        key={index}
                                      >
                                        <div className="ProfileFollowImgContent">
                                          {followedData.avatar ? (
                                            <>
                                              <Link
                                                to={`/home/profile/user/${followedData.id}`}
                                                className="suggestionFriend-title-link"
                                              >
                                                <img
                                                  src={followedData.avatar}
                                                />
                                              </Link>
                                            </>
                                          ) : (
                                            <>
                                              <Link
                                                to={`/home/profile/user/${followedData.id}`}
                                                className="ProfileFollowLink"
                                                onClick={
                                                  handleCloseModalFollowed
                                                }
                                              >
                                                <img src="https://i.pinimg.com/564x/64/b9/dd/64b9dddabbcf4b5fb2b885927b7ede61.jpg" />
                                              </Link>
                                            </>
                                          )}
                                        </div>
                                        <span>
                                          <Link
                                            to={`/home/profile/user/${followedData.id}`}
                                            className="ProfileFollowLink"
                                            onClick={handleCloseModalFollowed}
                                          >
                                            {followedData.name
                                              ? followedData.name
                                              : followedData.username}
                                          </Link>
                                        </span>
                                        {followedData.isFollowme ? null : followedData.isFollow ? (
                                          <button
                                            onClick={() =>
                                              handleRemove(followedData.id)
                                            }
                                          >
                                            Unfollow
                                          </button>
                                        ) : (
                                          <button
                                            onClick={() =>
                                              handleAdd(followedData.id)
                                            }
                                          >
                                            Follow
                                          </button>
                                        )}
                                      </div>
                                    </>
                                  );
                                })
                              ) : (
                                <div className="ProfileFollowRowContent">
                                  <span>Không có ai theo dõi</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        {searchUserFollowed && searchUserFollowed.length > 0 ? (
                          <></>
                        ) : followedData &&
                          followedData.length > 0 &&
                          followedData.length < 5 ? (
                          <></>
                        ) : (
                          !isMoreDetailFollowed && (
                            <div
                              className="ProfileFollowButtonMoreDetail"
                              onClick={handleMoreDetailFollowed}
                            >
                              <button>Xem thêm</button>
                            </div>
                          )
                        )}
                      </Modal.Body>
                    </Modal>
                    <span>
                      <Link to={`/home/messenger/${userID}`}>Nhắn tin</Link>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="ProfileRowDescription">
              <p className="ProfileDescriptionUser">
                <span>
                  {userData.moTa && userData.moTa.length > 100 && !showMore
                    ? userData.moTa.slice(0, 100) + "..."
                    : userData.moTa}
                </span>
                {userData.moTa && userData.moTa.length > 100 && (
                  <span className="read-more" onClick={handleClickShowMore}>
                    {showMore ? "Rút gọn" : "Xem thêm"}
                  </span>
                )}
              </p>
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
