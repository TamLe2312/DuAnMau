import React, { useState, useEffect } from "react";
import SettingsIcon from "@mui/icons-material/Settings";
import GridOnIcon from "@mui/icons-material/GridOn";
import Validation from "../../component/validation/validation";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MyModal from "../modal/Modal";
import FiberManualRecordOutlinedIcon from "@mui/icons-material/FiberManualRecordOutlined";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import InfiniteScroll from "react-infinite-scroll-component";
import { useCookies } from "react-cookie";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "sonner";
import { useParams, useNavigate } from "react-router-dom";
import Post from "../timeline/post/Post";
import * as request from "../../utils/request";
import "./Groups.css";
import InviteGroup from "./inviteGroup";
import TotalMemberModal from "./totalMembersModal";

function Groups() {
  const Navigate = useNavigate();
  const groupID = useParams();
  const [loading, setLoading] = useState(false);
  const [showModalAvatar, setShowModalAvatar] = useState(false);
  const [showModalPostGroup, setShowModalPostGroup] = useState(false);
  const [cookies] = useCookies();
  const [showModalInformationProfile, setShowModalInformationProfile] =
    useState(false);
  const [showModalConfirmDelete, setShowModalConfirmDelete] = useState(false);
  const [showModalInviteGroup, setShowModalInviteGroup] = useState(false);
  const [showModalTotalMembers, setShowModalTotalMembers] = useState(false);
  const [hasAvatarGroup, setHasAvatarGroup] = useState(null);
  const [groupDataProfile, setGroupDataProfile] = useState("");
  const [formValues, setFormValues] = useState({
    name: "",
    moTaNhom: "",
    privacy: "",
  });
  const [error, setError] = useState({});
  const [TotalMembers, setTotalMembers] = useState(0);
  const [CountPostGroup, setCountPostGroup] = useState(0);
  const idUser = cookies.userId;
  const [userData, setUserData] = useState("");
  const [content, setContent] = useState("");
  const [listiPostGroup, setListiPostGroup] = useState([]);
  const [imgsPostGroup, setImgsPostGroup] = useState([]);
  const [postsDataGroup, setpostsDataGroup] = useState([]);
  const [pageData, setpageData] = useState(2);
  const [isHaveInform, setIsHaveInform] = useState(false);
  // id account

  const fetchDataCountPostGroup = async (groupId) => {
    try {
      const response = await request.get(`groups/CountPostGroup/${groupId}`); // Thay đổi ID tùy theo người dùng muốn lấy dữ liệu
      setCountPostGroup(response.data.results[0].countPostGroup);
    } catch (error) {
      console.error("Error fetching user data:", error);
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
  const handleChangeContent = (e) => {
    setContent({
      ...content,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmitPostGroup = async () => {
    setLoading(true);
    let groupId = groupID.groupID;
    const postData = {
      groupId: groupId,
      userId: idUser,
      content: content,
    };
    const formData = new FormData();
    if (imgsPostGroup.length > 0) {
      try {
        const response = await request.post("post/createGroupPost", postData);
        listiPostGroup.forEach((img, index) => {
          formData.append(`image${index}`, img);
        });
        formData.append("postGroupId", response.data.lastID);
        const responseImg = await request.post("post/groupUpImgs", formData);
        toast.success(responseImg.data.success);
        fetchData(groupID.groupID);
        fetchDataCountPostGroup(groupID.groupID);
        handleCloseModalPostGroup();
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const res = await request.post("post/createGroupPost", postData);
        toast.success(res.data.success);
        fetchData(groupID.groupID);
        fetchDataCountPostGroup(groupID.groupID);
        handleCloseModalPostGroup();
      } catch (error) {
        console.log(error);
      }
    }
    setLoading(false);
  };
  const handleFile = (event) => {
    const newImgs = [];
    const list = [];
    for (let i = 0; i < event.target.files.length; i++) {
      const selectedFile = event.target.files[i];
      list.push(selectedFile);
      newImgs.push(URL.createObjectURL(selectedFile));
    }
    setImgsPostGroup([...imgsPostGroup, ...newImgs]);
    setListiPostGroup([...listiPostGroup, ...list]);
    /*  const imageUrl = URL.createObjectURL(selectedFile);
         setSelectedImage(imageUrl);
         setImages(selectedFile); */
  };
  const [run, setRun] = useState(0);
  const handleRun = (e) => {
    const id = e.currentTarget.id;
    const length = imgsPostGroup.length;
    if (id === "left") {
      setRun((pre) => (pre === 0 ? length - 1 : pre - 1));
    } else {
      setRun((pre) => (pre === length - 1 ? 0 : pre + 1));
    }
  };

  const handleShowModalAvatar = () => {
    setShowModalAvatar(true);
  };

  const handleCloseModalAvatar = () => {
    setShowModalAvatar(false);
  };
  const handleShowModalPostGroup = () => {
    setContent("");
    setImgsPostGroup([]);
    setListiPostGroup([]);
    setShowModalPostGroup(true);
  };

  const handleCloseModalPostGroup = () => {
    setShowModalPostGroup(false);
  };
  const handleShowModalConfirmDelete = () => {
    setShowModalConfirmDelete(true);
  };

  const handleCloseModalConfirmDelete = () => {
    setShowModalConfirmDelete(false);
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
    const groupIdProfile = groupID.groupID;
    const imageUrl = groupDataProfile.avatarGroup;
    const url = new URL(imageUrl);
    const imagePath = url.pathname.substring("/uploads/".length);

    try {
      const response = await request.post("groups/removeAvatarGroup", {
        groupIdProfile,
        imagePath,
      });
      if (response.data.success) {
        setGroupDataProfile((prevUserData) => ({
          ...prevUserData,
          avatarGroup: "",
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
    setLoading(true);
    try {
      const formData = new FormData();
      const groupIdProfile = groupID.groupID;
      formData.append("avatarGroup", selectedFile);
      formData.append("groupId", groupIdProfile);
      formData.append("hasAvatarGroup", hasAvatarGroup);

      const response = await request.post(
        "groups/changeAvatarGroup",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const newAvatar = response.data.avatarGroup;
      setGroupDataProfile((prevGroupDataProfile) => ({
        ...prevGroupDataProfile,
        avatarGroup: newAvatar,
      }));
      toast.success(response.data.success);
      handleCloseModalAvatar();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };
  const handleShowModalInformationProfile = () => {
    setFormValues({
      name: "",
      privacy: "",
      moTaNhom: "",
    });
    setShowModalInformationProfile(true);
  };
  const handleCloseModalInformationProfile = () => {
    setIsHaveInform(false);
    setShowModalInformationProfile(false);
  };
  const handleModalButtonInviteGroup = () => {
    setShowModalInviteGroup(!showModalInviteGroup);
  };
  const handleModalTotalMembers = () => {
    setShowModalTotalMembers(!showModalTotalMembers);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(Validation(formValues));
    try {
      setLoading(true);
      const groupIdProfile = groupID.groupID;
      const response = await request.post(
        "groups/UpdateInformationProfileGroup",
        {
          name: formValues.name,
          moTaNhom: formValues.moTaNhom,
          privacy: formValues.privacy,
          groupId: groupIdProfile,
        }
      );
      if (response.data.success) {
        toast.success(response.data.success);
      }
      setLoading(false);
      const nameGroup = response.data.name;
      const moTaGroup = response.data.moTaNhom;
      setGroupDataProfile((prevUserData) => ({
        ...prevUserData,
        name: nameGroup,
        moTaNhom: moTaGroup,
      }));
      handleCloseModalInformationProfile();
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.error);
      }
      setLoading(false);
    }
  };
  const handleRemoveGroup = async () => {
    setLoading(true);
    const groupIdProfile = groupID.groupID;
    console.log(groupIdProfile);
    try {
      const response = await request.post("groups/removeGroup", {
        groupIdProfile,
        hasAvatarGroup,
      });
      Navigate("/home/community", { replace: true });
      toast.success(response.data.success);
      handleCloseModalAvatar();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };
  useEffect(() => {
    const groupIdProfile = groupID.groupID;
    const fetchDataCountPostGroup = async () => {
      setLoading(true);
      try {
        const response = await request.get(`groups/group/${groupIdProfile}`);
        setGroupDataProfile(response.data[0]);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    fetchDataCountPostGroup();
  }, [groupID]);
  const [hasJoined, setHasJoined] = useState(false);
  useEffect(() => {
    const groupIdProfile = groupID.groupID;
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await request.get(
          `groups/TotalMembers/${groupIdProfile}&${idUser}`
        );
        if (response.data.hasJoined) {
          setHasJoined(true);
        }
        setTotalMembers(response.data.results[0].totalMembers);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [groupID, idUser]);
  useEffect(() => {
    if (groupDataProfile.avatarGroup) {
      const imageUrl = groupDataProfile.avatarGroup;
      const url = new URL(imageUrl);
      const imagePath = url.pathname.substring("/uploads/".length);
      if (imagePath) {
        setHasAvatarGroup(imagePath);
      }
    }
  }, [groupDataProfile]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await request.get(`account/getDataUser/${idUser}`); // Thay đổi ID tùy theo người dùng muốn lấy dữ liệu
        setUserData(response.data[0]);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchData();
  }, [idUser]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await request.get(`account/getDataUser/${idUser}`); // Thay đổi ID tùy theo người dùng muốn lấy dữ liệu
        setUserData(response.data[0]);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchData();
  }, [idUser]);
  useEffect(() => {
    const fetchData = async () => {
      const groupPostId = groupID.groupID;
      try {
        const response = await request.get(
          `groups/CountPostGroup/${groupPostId}`
        ); // Thay đổi ID tùy theo người dùng muốn lấy dữ liệu
        setCountPostGroup(response.data.results[0].countPostGroup);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchData();
  }, [groupID]);

  const fetchData = async (groupId) => {
    try {
      const response = await request.get(`groups/postGroupData/${groupId}&1`);
      setpostsDataGroup(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  const [chay, setChay] = useState(false);
  useEffect(() => {
    setChay(true);
    fetchData(groupID.groupID);
    setpageData(2);
  }, []);
  useEffect(() => {
    const fetchDataAndSetChay = () => {
      setpageData(2);
      if (chay) {
        setTimeout(() => {
          fetchData(groupID.groupID);
          setChay(false);
        }, 1000);
      }
    };
    fetchDataAndSetChay();
  }, [chay]);
  const fetchDataNew = () => {
    setpageData(pageData + 1);
    const dataNew = async () => {
      const groupId = groupID.groupID;
      const response = await request.get(
        `groups/postGroupData/${groupId}&${pageData}`
      );
      if (response.status === 200) {
        const datas = response.data;
        setpostsDataGroup(postsDataGroup.concat(datas));
      } else {
        console.log("Lỗi rồi");
      }
    };
    dataNew();
  };
  return (
    <>
      <div className="container-fluid" style={{ overflowX: "hidden" }}>
        <div className="container GroupContentContainer">
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
                      onClick={handleShowModalAvatar}
                      title="ChangeAvatar"
                    >
                      {loading ? (
                        <div>Loading....</div>
                      ) : groupDataProfile && !groupDataProfile.avatarGroup ? (
                        <img
                          className="ProfileAvatarImg"
                          src="https://i.pinimg.com/564x/64/b9/dd/64b9dddabbcf4b5fb2b885927b7ede61.jpg"
                          alt="Avatar"
                        />
                      ) : (
                        <img
                          className="ProfileAvatarImg"
                          src={groupDataProfile.avatarGroup}
                          alt="Avatar"
                        />
                      )}
                    </Button>
                    <Modal
                      show={showModalAvatar}
                      onHide={handleCloseModalAvatar}
                    >
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
                              name="avatarGroup"
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
                  {groupDataProfile.name ? (
                    <p className="ProfileTitle">{groupDataProfile.name}</p>
                  ) : (
                    <p className="ProfileTitle">Loading....</p>
                  )}
                  <div className="ProfileLinkContainer">
                    {groupDataProfile &&
                    groupDataProfile.idUserCreatedGroup === idUser ? (
                      <div
                        className="ProfileSettingIcon"
                        onClick={handleShowModalInformationProfile}
                      >
                        <SettingsIcon />
                      </div>
                    ) : (
                      <></>
                    )}
                    <Modal
                      centered
                      show={showModalInformationProfile}
                      onHide={handleCloseModalInformationProfile}
                    >
                      <Modal.Header closeButton>
                        <Modal.Title>Chỉnh sửa thông tin nhóm</Modal.Title>
                      </Modal.Header>
                      <Modal.Body className="ProfileInformationModalBody">
                        <Form onSubmit={handleSubmit}>
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
                            <Form.Label>Mô tả</Form.Label>
                            <Form.Control
                              as="textarea"
                              name="moTaNhom"
                              value={formValues.moTaNhom}
                              onChange={handleChange}
                              className="form-control"
                            />
                          </Form.Group>
                          <Form.Group controlId="formPrivacy">
                            <Form.Label>Quyền riêng tư</Form.Label>
                            <Form.Control
                              as="select"
                              name="privacy"
                              value={formValues.privacy}
                              onChange={handleChange}
                              className="form-control"
                            >
                              <option value=""></option>
                              <option value="public">Công khai</option>
                              <option value="private">Riêng tư</option>
                            </Form.Control>
                          </Form.Group>
                          <br />
                          <Modal.Footer>
                            {groupDataProfile &&
                            groupDataProfile.idUserCreatedGroup === idUser ? (
                              <Button
                                variant="danger"
                                onClick={handleShowModalConfirmDelete}
                              >
                                {loading ? "Deleting..." : "Delete Group"}
                              </Button>
                            ) : (
                              <></>
                            )}
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
                            <Modal
                              show={showModalConfirmDelete}
                              onHide={handleCloseModalConfirmDelete}
                            >
                              <Modal.Body className="ConfirmDeleteModalBody">
                                <h4>Xác nhận xóa group</h4>
                                <div>
                                  <Button
                                    variant="danger"
                                    onClick={handleRemoveGroup}
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
                          </Modal.Footer>
                        </Form>
                      </Modal.Body>
                    </Modal>
                  </div>
                  {hasJoined && (
                    <div className="ProfileButtonContainer">
                      <button
                        className="ProfileButtonInvite"
                        onClick={handleModalButtonInviteGroup}
                      >
                        <p className="ProfileButtonInviteText">Mời</p>
                      </button>
                    </div>
                  )}
                  <MyModal
                    text={"Mời bạn bè tham gia nhóm"}
                    show={showModalInviteGroup}
                    onHide={handleModalButtonInviteGroup}
                    childrens={<InviteGroup groupId={groupID.groupID} />}
                  />
                </div>
                <div className="ProfileRow">
                  <div className="ProfileInformationContainer">
                    <span style={{ marginRight: 10 }}>
                      <b>{CountPostGroup}</b> bài viết
                    </span>
                    <span>
                      <a onClick={handleModalTotalMembers}>
                        Có <b>{TotalMembers}</b> thành viên
                      </a>
                      <MyModal
                        text={"Thành viên nhóm"}
                        show={showModalTotalMembers}
                        onHide={handleModalTotalMembers}
                        childrens={<TotalMemberModal />}
                        display={"block"}
                      />
                    </span>
                  </div>
                </div>
                {groupDataProfile.moTaNhom ? (
                  <div className="ProfileRow">
                    <p>{groupDataProfile.moTaNhom}</p>
                  </div>
                ) : (
                  <div className="ProfileRow">
                    <p>Loading....</p>
                  </div>
                )}
              </div>
            </div>
          </header>

          <div className="container containerFeature">
            <div className="row justify-content-center align-items-center">
              {/* <div className="col-md-3 ColumnProfileFeature">
                                <a>
                                    <GridOnIcon />
                                    <span>bài viết</span>
                                </a>
                            </div> */}
              <hr />
            </div>
          </div>
          {hasJoined && (
            <div className="container containerPostGroup">
              <div className="PostGroupContent">
                <div className="PostGroupAvatarContent">
                  {loading ? (
                    <div>Loading....</div>
                  ) : userData && !userData.avatar ? (
                    <img
                      src="https://i.pinimg.com/564x/64/b9/dd/64b9dddabbcf4b5fb2b885927b7ede61.jpg"
                      alt="Avatar"
                    />
                  ) : (
                    <img src={userData.avatar} alt="Avatar" />
                  )}
                </div>
                <button onClick={handleShowModalPostGroup}>
                  Hôm nay bạn thế nào...
                </button>
                <Modal
                  show={showModalPostGroup}
                  onHide={handleCloseModalPostGroup}
                  size="lg"
                  centered
                >
                  <Modal.Header closeButton>
                    <Modal.Title>Tạo bài viết</Modal.Title>
                  </Modal.Header>
                  <Modal.Body className="modal-body">
                    <div className="container">
                      <div className="row">
                        <div className="col-md-5 PostGroupColumnContent5">
                          {imgsPostGroup.length === 0 && (
                            <>
                              <input
                                id="ImgUploadFileGroupPost"
                                multiple
                                type="file"
                                onChange={(e) => {
                                  handleFile(e);
                                }}
                              />
                              <label
                                htmlFor="ImgUploadFileGroupPost"
                                className="LabelForImgUploadGroupPost"
                              >
                                Chọn hình ảnh &nbsp;
                                <i className="fa-solid fa-images"></i>
                              </label>
                            </>
                          )}
                          {imgsPostGroup.length > 0 && (
                            <>
                              <span
                                id="left"
                                className="PrevButtonIcon"
                                onClick={(e) => handleRun(e)}
                              >
                                <ChevronLeftIcon sx={{ fontSize: 40 }} />
                              </span>
                              <img src={imgsPostGroup[run]} alt="" />
                              <span
                                id="right"
                                className="NextButtonIcon"
                                onClick={(e) => handleRun(e)}
                              >
                                <ChevronRightIcon sx={{ fontSize: 40 }} />
                              </span>
                              <span className="ImgPostGroupListDot">
                                {imgsPostGroup.map((img, index) => {
                                  return (
                                    <span key={index} className="imgNews-dot">
                                      {index === run ? (
                                        <FiberManualRecordIcon />
                                      ) : (
                                        <FiberManualRecordOutlinedIcon />
                                      )}
                                    </span>
                                  );
                                })}
                              </span>
                            </>
                          )}
                        </div>
                        <div className="col-md-7 PostGroupColumnContent7">
                          <div className="PostGroupAuthor">
                            <div className="PostGroupAvatarContent">
                              {loading ? (
                                <div>Loading....</div>
                              ) : userData && !userData.avatar ? (
                                <img
                                  src="https://i.pinimg.com/564x/64/b9/dd/64b9dddabbcf4b5fb2b885927b7ede61.jpg"
                                  alt="Avatar"
                                />
                              ) : (
                                <img src={userData.avatar} alt="Avatar" />
                              )}
                            </div>
                            <span>
                              {userData && userData.name
                                ? userData.name
                                : userData.username}
                            </span>
                          </div>
                          <textarea
                            className="PostGroupContentNew"
                            name="PostGroupContentNew"
                            id="PostGroupContentNew"
                            cols="55"
                            rows="10"
                            placeholder="Hôm nay bạn thế nào...."
                            onChange={handleChangeContent}
                          ></textarea>
                          <div className="PostGroupContentNewButton">
                            <button
                              type="button"
                              disabled={!content || loading}
                              className="btn btn-primary"
                              onClick={handleSubmitPostGroup}
                            >
                              Đăng lên...
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Modal.Body>
                </Modal>
              </div>
            </div>
          )}
          {postsDataGroup.length > 0 ? (
            postsDataGroup.map((data, index) => {
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
                      groupPostId={data.id}
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
          <InfiniteScroll
            dataLength={postsDataGroup.length + 1}
            next={fetchDataNew}
            hasMore={true}
            // loader={<h4>Loading...</h4>}
          ></InfiniteScroll>
        </div>
      </div>
    </>
  );
}

export default Groups;
