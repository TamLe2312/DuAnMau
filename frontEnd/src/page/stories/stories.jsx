import "./stories.css";
import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
import TextField from "@mui/material/TextField";
import imageLogo from "../../../uploads/Logo1.png";
import { useCookies } from "react-cookie";
import { useEffect, useRef, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "sonner";
import request from "../../utils/request";
import { useSpring, animated } from "react-spring";

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
  const [isCreateNewsImg, setIsCreateNewsImg] = useState(false);
  const [isCreateNewsContent, setIsCreateNewsContent] = useState(false);

  const { width } = useSpring({
    from: { width: "0%" },
    to: { width: "100%" },
    config: { duration: 10000 },
  });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      console.log("Xong");
    }, 10000);

    return () => clearTimeout(timeoutId);
  }, []);

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
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

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
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await request.get(`post/getDataNews`);
        setDataNews(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchData();
  }, []);
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
            <img
              className="StoriesAvatarImg"
              src="https://i.pinimg.com/564x/e3/0f/28/e30f28122578d6a5fc183376718d46c3.jpg"
            />
            <span className="StoriesName">Tâm</span>
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
                  <div className="StoriesNavBarRow" key={index}>
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
          <div className="StoriesDisplayContainer">
            <div className="StoriesWatchNews">
              <div>
                <span>Hello,Test 11231232</span>
              </div>
              <div className="StoriesTimeline">
                <animated.div
                  className="progress-bar"
                  style={{
                    width,
                    height: "8px",
                    backgroundColor: "#ff0000", // Màu đỏ
                    borderRadius: "4px",
                  }}
                />
              </div>
            </div>
          </div>
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
