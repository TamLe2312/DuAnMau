import "./stories.css";
import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
import TextField from "@mui/material/TextField";
import imageLogo from "../../../uploads/Logo1.png";
import { useCookies } from "react-cookie";
import { useEffect, useRef, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "sonner";
import request from "../../utils/request";
import MyModal from "../../component/modal/Modal";
import ModalStories from "./modalStories";

function Stories() {
  const idUserNews = useParams();
  const refSearch = useRef();
  const Navigate = useNavigate();
  const [cookies] = useCookies(["session"]);
  const id = cookies.userId;
  const maxLengthType = 800;
  const fileInputRef = useRef(null);
  const [searchValue, setSearchValue] = useState("");
  const [newsImg, setNewsImg] = useState([]);
  const [dataNews, setDataNews] = useState([]);
  const [dataWatch, setDataWatch] = useState([]);
  const [dataUser, setDataUser] = useState([]);
  const [isCreateNewsImg, setIsCreateNewsImg] = useState(false);
  const [isCreateNewsContent, setIsCreateNewsContent] = useState(false);
  const [indexWatch, setIndexWatch] = useState(0);
  const [modalStories, setModalStories] = useState(false);

  const handleInputChange = async (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) {
      toast.error("Chưa có ảnh");
      return; // Dừng việc xử lý nếu không có file được chọn
    }
    if (selectedFile.length > 1) {
      toast.error("Chỉ up được 1 ảnh duy nhất");
      return; // Dừng việc xử lý nếu nhiều hơn 1 ảnh
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

    setNewsImg(selectedFile);
    setIsCreateNewsImg(true);
  };

  const handleCreateNews = async (type) => {
    setNewsImg("");
    setSearchValue("");
    if (type === "image") {
      fileInputRef.current.click();
    } else if (type === "content") {
      setIsCreateNewsContent(true);
    }
  };
  const handleCancelUpNews = () => {
    setIsCreateNewsContent(false);
    setIsCreateNewsImg(false);
  };

  const handleUpNews = async () => {
    if (newsImg) {
      try {
        const formData = new FormData();
        formData.append("newsImg", newsImg);
        formData.append("id", id);
        const res = await request.post("post/storiesImg", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        if (res.data.success) {
          toast.success(res.data.success);
          Navigate("/home", { replace: true });
        }
      } catch (err) {
        console.error(err);
      }
    }
    if (searchValue) {
      try {
        const res = await request.post("post/storiesContent", {
          searchValue: searchValue,
          id: id,
        });
        if (res.data.success) {
          toast.success(res.data.success);
          Navigate("/home", { replace: true });
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const validateTime = (createdAt) => {
    const now = new Date();
    const diff = now - new Date(createdAt);

    const timeUnits = [
      { unit: "năm", divisor: 365 * 24 * 60 * 60 * 1000 },
      { unit: "tháng", divisor: 30 * 24 * 60 * 60 * 1000 },
      { unit: "ngày", divisor: 24 * 60 * 60 * 1000 },
      { unit: "giờ", divisor: 60 * 60 * 1000 },
      { unit: "phút", divisor: 60 * 1000 },
      { unit: "giây", divisor: 1000 },
    ];

    const unit = timeUnits.find(({ divisor }) => diff >= divisor);

    if (!unit) {
      return "Vừa mới đây";
    }

    const value = Math.floor(diff / unit.divisor);

    return `${value} ${unit.unit} trước`;
  };

  const handleRowContainerClick = (userId) => {
    setIndexWatch(0);
    Navigate(`/stories/${userId}`, { replace: true });
  };

  const getLinkTo = () => {
    if (dataNews && dataNews.length > 0 && id) {
      const foundItem = dataNews.find((item) => item.user_id === Number(id));
      if (foundItem) {
        return `/stories/${id}`;
      } else {
        return `/stories/create`;
      }
    }
  };

  const handlePrevStories = (index) => {
    if (index - 1 >= 0) {
      setIndexWatch(index - 1);
    } else {
      if (currentIndex >= 0) {
        const prevNews = currentIndex - 1;
        setIndexWatch(0);
        Navigate(`/stories/${dataNews[prevNews].user_id}`, { replace: true });
      }
    }
  };

  const handleNextStories = (index) => {
    if (index + 1 < dataWatch.length) {
      setIndexWatch(index + 1);
    } else {
      if (currentIndex < dataNews.length) {
        const nextNews = currentIndex + 1;
        setIndexWatch(0);
        Navigate(`/stories/${dataNews[nextNews].user_id}`, { replace: true });
      }
    }
  };

  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const handleModal = () => {
    setModalStories(!modalStories);
  };

  useEffect(() => {
    const fetchData = () => {
      if (searchValue.length === maxLengthType) {
        toast.error(`Bạn không được nhập quá ${maxLengthType} kí tự`);
      }
    };

    fetchData();

    // Enable the button if there is some text entered or an image is selected
    setIsButtonDisabled(!(searchValue.length > 0 || newsImg));
  }, [searchValue, newsImg]);
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await request.get(`post/getDataNews`);
        if (!isNaN(idUserNews.idStory)) {
          const index = response.data.findIndex(
            (item) => item.user_id === Number(idUserNews.idStory)
          );
          if (index !== -1) {
            setCurrentIndex(index);
          }
        }
        setDataNews(response.data);
        const respone1 = await request.get(`account/getDataUser/${id}`);
        setDataUser(respone1.data[0]);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchData();
  }, [id]);
  useEffect(() => {
    const fetchData = async () => {
      const idNews = idUserNews.idStory;
      try {
        const res = await request.get(`post/getDataNewsUser/${idNews}`);
        setDataWatch(res.data);
        if (!isNaN(idUserNews.idStory)) {
          const index = dataNews.findIndex(
            (item) => item.user_id === Number(idUserNews.idStory)
          );
          if (index !== -1) {
            setCurrentIndex(index);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchData();
  }, [idUserNews]);

  return (
    <div className="StoriesContainer">
      <div className="StoriesNavBar">
        <div className="StoriesNavBarHeader">
          <Link to="/home">
            <i className="fa-solid fa-xmark"></i>
          </Link>
          <Link to="/home">
            <img className="navigation-logo" src={imageLogo} alt="FPLHub" />
          </Link>
        </div>
        <div className="StoriesNavBarContainer">
          <h3>Tin</h3>
          <div className="StoriesNavBarInform">
            <Link to={getLinkTo()}>
              <img
                className="StoriesAvatarImg"
                src={
                  dataUser.avatar
                    ? dataUser.avatar
                    : "https://i.pinimg.com/564x/64/b9/dd/64b9dddabbcf4b5fb2b885927b7ede61.jpg"
                }
              />
            </Link>
            <Link to={getLinkTo()}>
              <span className="StoriesName">
                {dataUser.name ? dataUser.name : dataUser.username}
              </span>
            </Link>
          </div>
          {isCreateNewsImg || isCreateNewsContent ? (
            <>
              <div className="StoriesRowContainer">
                {isCreateNewsContent && (
                  <form>
                    <TextField
                      ref={refSearch}
                      label="Bắt đầu nhập"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      onChange={(e) => setSearchValue(e.target.value)}
                      inputProps={{
                        maxLength: maxLengthType, // Giới hạn kí tự
                      }}
                    />
                  </form>
                )}
              </div>
              <div className="StoriesHandleButton">
                <button
                  className="btn btn-secondary"
                  onClick={handleCancelUpNews}
                >
                  Bỏ
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleUpNews}
                  disabled={isButtonDisabled}
                >
                  Chia sẻ lên tin
                </button>
              </div>
            </>
          ) : (
            <div className="StoriesRowContainer">
              {dataNews && dataNews.length > 0 ? (
                dataNews.map((data, index) => (
                  <div
                    className="StoriesNavBarRow"
                    key={index}
                    onClick={() => handleRowContainerClick(data.user_id)}
                  >
                    <img
                      className="StoriesAvatarImg"
                      src={
                        data.avatar
                          ? data.avatar
                          : "https://i.pinimg.com/564x/64/b9/dd/64b9dddabbcf4b5fb2b885927b7ede61.jpg"
                      }
                    />
                    <div className="StoriesInformGroup">
                      <span className="StoriesName">
                        {data.name ? data.name : data.username}
                      </span>
                      <span className="StoriesTime">
                        {validateTime(data.created_at)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <span>Không có tin</span>
              )}
            </div>
          )}
        </div>
      </div>
      {!isNaN(idUserNews.idStory) ? (
        <div className="StoriesDisplay">
          <i
            className="fa-solid fa-chevron-left"
            onClick={() => handlePrevStories(indexWatch)}
          ></i>
          <div className="StoriesDisplayContainer">
            <div className="StoriesWatchNews">
              <div className="StoriesWatchHeader">
                <div className="StoriesWatchInformUser">
                  {dataNews && dataNews[currentIndex] && (
                    <>
                      <Link
                        to={
                          dataNews[currentIndex].user_id === id
                            ? `/home/profile`
                            : `/home/profile/user/${dataNews[currentIndex].user_id}`
                        }
                      >
                        <div className="StoriesWatchImgHeader">
                          <img
                            src={
                              dataNews[currentIndex].avatar
                                ? dataNews[currentIndex].avatar
                                : "https://i.pinimg.com/564x/64/b9/dd/64b9dddabbcf4b5fb2b885927b7ede61.jpg"
                            }
                          />
                        </div>
                      </Link>
                      <Link
                        to={
                          dataNews[currentIndex].user_id === id
                            ? `/home/profile`
                            : `/home/profile/user/${dataNews[currentIndex].user_id}`
                        }
                      >
                        <span>
                          {dataNews[currentIndex].name
                            ? dataNews[currentIndex].name
                            : dataNews[currentIndex].username}
                        </span>
                      </Link>
                    </>
                  )}
                  {dataNews &&
                    dataNews[currentIndex] &&
                    dataNews[currentIndex].user_id === id && (
                      <i
                        className="fa-solid fa-ellipsis"
                        onClick={handleModal}
                      ></i>
                    )}
                  <MyModal
                    text={""}
                    show={modalStories}
                    onHide={handleModal}
                    display={"block"}
                    childrens={
                      <ModalStories
                        idNews={
                          dataWatch[indexWatch] && dataWatch[indexWatch].id
                        }
                      />
                    }
                  />
                </div>
                <div className="StoriesTimeline">
                  <span>
                    {indexWatch + 1}/{dataWatch.length}
                  </span>
                </div>
              </div>
              <div className="StoriesWatchContainer">
                {dataWatch &&
                  dataWatch.length > 0 &&
                  dataWatch[indexWatch] &&
                  (dataWatch[indexWatch].content ? (
                    <span>{dataWatch[indexWatch].content}</span>
                  ) : (
                    <img src={dataWatch[indexWatch].img} />
                  ))}
              </div>
            </div>
          </div>
          <i
            className="fa-solid fa-chevron-right"
            onClick={() => handleNextStories(indexWatch)}
          ></i>
        </div>
      ) : (
        <div className="StoriesDisplay">
          <div className="StoriesDisplayContainer">
            {isCreateNewsImg && (
              <div className="StoriesCreateNewsContainer">
                <span>Xem trước</span>
                <div className="StoriesCreateNewsBackground">
                  <div className="StoriesCreateImgContent">
                    <img src={newsImg && URL.createObjectURL(newsImg)} />
                  </div>
                </div>
              </div>
            )}
            {isCreateNewsContent && (
              <div className="StoriesCreateNewsContainer">
                <span>Xem trước</span>
                <div className="StoriesCreateNewsBackground">
                  <div className="StoriesCreateImgContent">
                    <span>{searchValue ? searchValue : "Bắt đầu nhập"}</span>
                  </div>
                </div>
              </div>
            )}
            {!isCreateNewsContent && !isCreateNewsImg && (
              <>
                <div
                  className="StoriesNewsImg"
                  onClick={() => handleCreateNews("image")}
                >
                  <Form encType="multipart/form-data">
                    <Form.Group>
                      <Form.Label
                        className="StoriesNewsImgLabel"
                        htmlFor="StoriesNewsImgInput"
                      >
                        Tạo tin với ảnh
                      </Form.Label>
                      <Form.Control
                        type="file"
                        name="newsImg"
                        accept="image/*"
                        id="StoriesNewsImgInput"
                        ref={fileInputRef}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                  </Form>
                </div>
                <div
                  className="StoriesNewsContent"
                  onClick={() => handleCreateNews("content")}
                >
                  <span>Tạo tin với chữ</span>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
export default Stories;
