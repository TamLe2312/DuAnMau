import axios from "axios";
import moment from "moment";
import React, { useState, useEffect } from "react";
import SettingsIcon from "@mui/icons-material/Settings";
import GridOnIcon from "@mui/icons-material/GridOn";
import Validation from "../../component/validation/validation";
import { useCookies } from "react-cookie";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import "./Groups.css"

function Groups() {
    const Navigate = useNavigate();
    const groupID = useParams();
    const [selectedImage, setSelectedImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showModalAvatar, setShowModalAvatar] = useState(false);
    const [cookies] = useCookies(["session"]);
    const [showModalInformationProfile, setShowModalInformationProfile] = useState(false);
    const [Images, setImages] = useState(null);
    const [hasAvatarGroup, setHasAvatarGroup] = useState(null);
    const [groupDataProfile, setGroupDataProfile] = useState("");
    const [formValues, setFormValues] = useState({
        name: "",
        moTaNhom: "",
    });
    const [error, setError] = useState({});
    const [TotalMembers, setTotalMembers] = useState(0);
    const idUser = cookies.userId;

    const handleChange = (e) => {
        setFormValues({
            ...formValues,
            [e.target.name]: e.target.value,
        });
    };

    const handleShowModalAvatar = () => {
        setShowModalAvatar(true);
    };

    const handleCloseModalAvatar = () => {
        setSelectedImage(null);
        setShowModalAvatar(false);
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
        const imageUrl = URL.createObjectURL(selectedFile);
        setSelectedImage(imageUrl);
        setImages(selectedFile);
    };
    const handleRemoveImage = async () => {
        setLoading(true);
        const groupIdProfile = groupID.groupID;
        const imageUrl = groupDataProfile.avatarGroup;
        const url = new URL(imageUrl);
        const imagePath = url.pathname.substring("/uploads/".length);

        try {
            const response = await axios.post(
                "http://localhost:8080/groups/removeAvatarGroup",
                {
                    groupIdProfile,
                    imagePath,
                }
            );
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
    const handleUploadImage = async () => {
        setLoading(true);
        try {
            const formData = new FormData();
            const groupIdProfile = groupID.groupID;
            console.log(groupIdProfile);
            formData.append("avatarGroup", Images);
            formData.append("groupId", groupIdProfile);
            formData.append("hasAvatarGroup", hasAvatarGroup);

            const response = await axios.post("http://localhost:8080/groups/changeAvatarGroup", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
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
            moTaNhom: "",
        });
        setShowModalInformationProfile(true);
    };
    const handleCloseModalInformationProfile = () => {
        setShowModalInformationProfile(false);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(Validation(formValues));
        try {
            setLoading(true);
            const groupIdProfile = groupID.groupID;
            const response = await axios.post(
                "http://localhost:8080/groups/UpdateInformationProfileGroup",
                {
                    name: formValues.name.trim(),
                    moTaNhom: formValues.moTaNhom.trim(),
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
            setLoading(false);
        }
    };
    const handleRemoveGroup = async () => {
        setLoading(true);
        const groupIdProfile = groupID.groupID;
        console.log(groupIdProfile);
        try {
            const response = await axios.post(
                "http://localhost:8080/groups/removeGroup",
                {
                    groupIdProfile,
                    hasAvatarGroup,
                }
            );
            Navigate("/home/community", { replace: true });
            toast.success(response.data.success);
            handleCloseModalAvatar();
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error(error);
        }
    }
    useEffect(() => {
        const groupIdProfile = groupID.groupID;
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(
                    `http://localhost:8080/groups/group/${groupIdProfile}`
                );
                setGroupDataProfile(response.data[0]);
                setLoading(false);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [groupID]);
    useEffect(() => {
        const groupIdProfile = groupID.groupID;
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(
                    `http://localhost:8080/groups/TotalMembers/${groupIdProfile}`
                );
                setTotalMembers(response.data[0].totalMembers);
                setLoading(false);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [groupID]);
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
    return (
        <>
            <div className="container-fluid">
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
                                            <Modal.Header closeButton>
                                                <Modal.Title>Thay đổi ảnh đại diện của nhóm</Modal.Title>
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
                                                <Form
                                                    encType="multipart/form-data"
                                                >
                                                    <Form.Group>
                                                        <Form.Label className="HandleButtonProfile ProfileUploadColor" htmlFor="ProfileUploadFile">Tải ảnh đại diện</Form.Label>
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
                                                {groupDataProfile.avatarGroup ? (
                                                    <label
                                                        className="HandleButtonProfile ProfileRemoveColor"
                                                        onClick={handleRemoveImage}
                                                    >
                                                        {loading ? "Remove..." : "Remove Avatar"}
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
                                    {groupDataProfile.name ? (
                                        <p className="ProfileTitle">
                                            {groupDataProfile.name}
                                        </p>
                                    ) :
                                        (
                                            <p className="ProfileTitle">
                                                Loading....
                                            </p>
                                        )}
                                    <div className="ProfileLinkContainer">
                                        {groupDataProfile && groupDataProfile.idUserCreatedGroup === idUser ? (
                                            <button
                                                className="ProfileLinkButton"
                                                onClick={handleShowModalInformationProfile}
                                            >
                                                <a href="#" className="ProfileLink">
                                                    Chỉnh sửa thông tin nhóm
                                                </a>
                                            </button>) :
                                            (<></>)
                                        }
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
                                                            name="moTaNhom"
                                                            value={formValues.moTaNhom}
                                                            onChange={handleChange}
                                                            className={
                                                                error.moTaNhom
                                                                    ? "form-control is-invalid"
                                                                    : "form-control"
                                                            }
                                                        />
                                                        {error.moTaNhom && (
                                                            <div
                                                                id="validationServerUsernameFeedback"
                                                                className="invalid-feedback"
                                                            >
                                                                {error.moTaNhom}
                                                            </div>
                                                        )}
                                                    </Form.Group>
                                                    <br />
                                                    <Modal.Footer>
                                                        {groupDataProfile && groupDataProfile.idUserCreatedGroup === idUser ?
                                                            (
                                                                <Button
                                                                    variant="danger"
                                                                    onClick={handleRemoveGroup}
                                                                >
                                                                    {loading ? "Deleting..." : "Delete Group"}
                                                                </Button>
                                                            ) :
                                                            (
                                                                <></>
                                                            )
                                                        }
                                                        <Button
                                                            variant="primary"
                                                            type="submit"
                                                            onClick={handleSubmit}
                                                        >
                                                            {loading ? "Submit..." : "Submit"}
                                                        </Button>
                                                    </Modal.Footer>
                                                </Form>
                                            </Modal.Body>
                                        </Modal>
                                    </div>
                                </div>
                                <div className="ProfileRow">
                                    <div>
                                        <span>0 bài viết</span>
                                        <span>
                                            <a href="#">
                                                Có <b>{TotalMembers}</b> thành viên
                                            </a>
                                        </span>
                                    </div>
                                </div>
                                {groupDataProfile.moTaNhom ? (
                                    <div className="ProfileRow">
                                        <p>{groupDataProfile.moTaNhom}</p>
                                    </div>
                                ) :
                                    (
                                        <div className="ProfileRow">
                                            <p>Loading....</p>
                                        </div>
                                    )}
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
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Groups;