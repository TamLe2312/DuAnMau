import axios from "axios";
import React, { useState, useEffect } from "react";
import Validation from "../../component/validation/validation";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SearchIcon from '@mui/icons-material/Search';
import moment from 'moment';
import "./Community.css"

function Community() {
  const [dataGroup, setDataGroup] = useState([])
  const [hasJoined, setHasJoined] = useState([])
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const [cookies] = useCookies(["session"]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [Images, setImages] = useState(null);
  const [showModalCreateGroup, setShowModalCreateGroup] = useState(false);
  const [formValues, setFormValues] = useState({
    name: "",
    moTa: "",
  });
  const [searchValue, setSearchValue] = useState("");
  const [searchGroup, setSearchGroup] = useState([]);
  const id = cookies.userId;
  const handleChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };
  const handleSearchChange = (e) => {
    setSearchValue(preSearchValue => ({
      ...preSearchValue,
      [e.target.name]: e.target.value,
    }))
  }
  const handleKeyEnter = async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      try {
        const response = await axios.post("http://localhost:8080/groups/searchGroup", searchValue);
        console.log(response);
        if (response && response.data) {
          const formattedData = response.data.map((item) => {
            const createdAt = item.createdAt;
            const formattedDate = moment(createdAt).format('MMMM Do, YYYY');
            return {
              ...item,
              created_at: formattedDate
            };
          });
          setSearchGroup(formattedData);
        }
        else {
          setSearchGroup([]);
        }
      } catch (err) {
        if (err.response && err.response.status === 400) {
          toast.error("Đã xảy ra lỗi khi tìm kiếm");
        }
      }
    }
    if (e.key === 'Backspace' || e.key === 'Delete') {
      setSearchGroup([]);
    }
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
  const handleCloseModalCreateGroup = () => {
    setShowModalCreateGroup(false);
  };

  const handleShowModalCreateGroup = () => {
    console.log(hasJoined);
    setFormValues({
      name: "",
      moTa: "",
    });
    setSelectedImage(null);
    setShowModalCreateGroup(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(Validation(formValues));
    setLoading(true);
    try {
      const formData = new FormData();

      formData.append("avatarGroup", Images);
      formData.append("name", formValues.name.trim());
      formData.append("moTa", formValues.moTa.trim());
      formData.append("idCreatedGroup", id);

      const response = await axios.post("http://localhost:8080/groups/createGroup", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data.success) {
        toast.success(response.data.success);
        const formattedData = response.data.results.map((item) => {
          const createdAt = item.createdAt;
          const formattedDate = moment(createdAt).format('MMMM Do, YYYY');
          return {
            ...item,
            created_at: formattedDate
          };

        });
        setDataGroup(formattedData);
      }
      setLoading(false);
      handleCloseModalCreateGroup();
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error("Tên nhóm đã tồn tại.Vui lòng nhập tên khác");
      }
      setLoading(false);
    }
  }
  const handleJoinGroup = async (groupId) => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8080/groups/joinGroup", {
        groupId: groupId,
        idUser: id,
      });
      if (response.data.success) {
        toast.success(response.data.success);
        /* setHasJoined(response.data); */
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }
  const handleOutGroup = async (groupId) => {
    setLoading(true);
    try {
      const response = await axios.post(`http://localhost:8080/groups/outGroup`, {
        groupId: groupId,
        idUser: id,
      });
      if (response.data.success) {
        toast.success(response.data.success);
        /* setHasJoined(response.data); */
      }
      setLoading(false);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error);
        /* setHasJoined(response.data); */
      }
      setLoading(false);
    }
  }
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:8080/groups/getDataGroup`
        );
        if (response && response.data) {
          const formattedData = response.data.map((item) => {
            const createdAt = item.createdAt;
            const formattedDate = moment(createdAt).format('MMMM Do, YYYY');
            return {
              ...item,
              created_at: formattedDate
            };
          });
          setDataGroup(formattedData);
        } else {
          setDataGroup([]);
        }
        setLoading(false);
      } catch (error) {
        if (error.response && error.response.status === 400) {
          setDataGroup([]);
        }
        console.error("Error fetching group data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/groups/getDataGroupJoined`
        );
        if (response && response.data) {
          setHasJoined(response.data);
        } else {
          setHasJoined([]);
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          setHasJoined([]);
        }
      }
    };
    const interval = setInterval(fetchData, 1000); // Chạy hàm fetchData() mỗi 2 giây

    return () => {
      clearInterval(interval); // Xóa bỏ interval khi component bị unmount
    };
  }, []);

  return (
    <>
      <div className="container-fluid" style={{ overflowX: 'hidden' }}>
        <div className="container containerCommunity">
          <div className="container" style={{ padding: 0 }}>
            <Form>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1" style={{ position: 'relative' }}>
                <Form.Control
                  type="text"
                  placeholder="Searching Group"
                  name="searchGroup"
                  value={searchValue.searchGroup || ''}
                  onChange={handleSearchChange}
                  onKeyDown={handleKeyEnter}
                />
                <SearchIcon style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }} />
              </Form.Group>
            </Form>
          </div>
          <div className="container containerCreateContentCommunity" onClick={handleShowModalCreateGroup}>
            <AddCircleOutlineIcon
              className='CommunityCreateIconGroup'
              style={{ color: 'var(#8083FF)' }}
            />
            <span>create a group</span>
          </div>
          <Modal
            show={showModalCreateGroup}
            onHide={handleCloseModalCreateGroup}
          >
            <Modal.Header closeButton>
              <Modal.Title>Tạo nhóm</Modal.Title>
            </Modal.Header>
            <Modal.Body className="CreateGroupModalBody">
              <Form
                onSubmit={handleSubmit}
                encType="multipart/form-data"
              >
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
                <Form.Group controlId="avatar">
                  <Form.Label>Tải ảnh nhóm</Form.Label>
                  <Form.Control
                    type="file"
                    name="avatarGroup"
                    accept="image/*"
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Form>
              <div className="ProfileShowImageContainer">
                {selectedImage ? (
                  <img
                    className="ShowImageWhenUpload"
                    src={selectedImage}
                    alt="Avatar"
                  />
                ) : (
                  <div></div>
                )}
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="primary"
                type="submit"
                onClick={handleSubmit}
                disabled={!selectedImage || loading}
              >
                {loading ? "Submit..." : "Submit"}
              </Button>
            </Modal.Footer>
          </Modal>
          <div className="container containerGroupContentCommunity">
            <h4 style={{ padding: '12px 0 0 12px' }}>Nhóm</h4>
            {loading || dataGroup.length < 1 ? (
              <div className="container">Loading...</div>
            ) : (
              <div></div>
            )}
            {searchGroup && searchGroup.length > 0 && dataGroup ? (
              searchGroup.map((searchGroup, index) => {
                let hasJoinedGroup = false;

                if (hasJoined && hasJoined.length > 0) {
                  for (let i = 0; i < hasJoined.length; i++) {
                    if (hasJoined[i].group_id === searchGroup.id && id === hasJoined[i].user_id) {
                      hasJoinedGroup = true;
                      break;
                    }
                  }
                }
                return (
                  <div className="container CommunityGroupRow" key={index}>
                    <a href={`/home/community/group/${searchGroup.id}`}>
                      {loading ? (
                        <div>Loading....</div>
                      ) : !searchGroup.avatarGroup ? (
                        <img
                          className='ImgGroupAvatar'
                          src="https://i.pinimg.com/564x/64/b9/dd/64b9dddabbcf4b5fb2b885927b7ede61.jpg"
                          alt="Avatar"
                        />
                      ) : (
                        <img
                          className='ImgGroupAvatar'
                          src={searchGroup.avatarGroup}
                          alt={searchGroup.name}
                        />
                      )}
                    </a>
                    <div className='CommunityInformationGroup'>
                      <span><a href={`/home/community/group/${searchGroup.id}`} className='CommunityInformationTitle'>{searchGroup.name}</a></span>
                      <span>Tạo vào {searchGroup.created_at}</span>
                    </div>
                    {hasJoinedGroup ? (
                      <div className='CommunityInformationButton'>
                        <button onClick={() => handleOutGroup(searchGroup.id)}>Đã tham gia</button>
                      </div>
                    ) :
                      (
                        <div className='CommunityInformationButton' key={index}>
                          <button onClick={() => handleJoinGroup(searchGroup.id)}>Tham Gia</button>
                        </div>
                      )}
                  </div>
                );
              })
            ) : (
              dataGroup && dataGroup.map((group, index) => {
                let hasJoinedGroup = false;

                if (hasJoined && hasJoined.length > 0) {
                  for (let i = 0; i < hasJoined.length; i++) {
                    if (hasJoined[i].group_id === group.id && id === hasJoined[i].user_id) {
                      hasJoinedGroup = true;
                      break;
                    }
                  }
                }
                return (
                  <div className="container CommunityGroupRow" key={index}>
                    <a href={`/home/community/group/${group.id}`}>
                      {loading ? (
                        <div>Loading....</div>
                      ) : !group.avatarGroup ? (
                        <img
                          className='ImgGroupAvatar'
                          src="https://i.pinimg.com/564x/64/b9/dd/64b9dddabbcf4b5fb2b885927b7ede61.jpg"
                          alt="Avatar"
                        />
                      ) : (
                        <img
                          className='ImgGroupAvatar'
                          src={group.avatarGroup}
                          alt={group.name}
                        />
                      )}
                    </a>
                    <div className='CommunityInformationGroup'>
                      <span><a href={`/home/community/group/${group.id}`} className='CommunityInformationTitle'>{group.name}</a></span>
                      <span>Tạo vào {group.created_at}</span>
                    </div>
                    {loading ? (
                      <div className='CommunityInformationButton'>
                        <button
                        >Loading....</button>
                      </div>
                    ) :
                      (
                        hasJoinedGroup ? (
                          <div className='CommunityInformationButton'>
                            <button
                              onClick={() => handleOutGroup(group.id)}
                            >Đã tham gia</button>
                          </div>
                        ) :
                          (
                            <div className='CommunityInformationButton' key={index}>
                              <button onClick={() => handleJoinGroup(group.id)}>Tham Gia</button>
                            </div>
                          )
                      )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Community;
