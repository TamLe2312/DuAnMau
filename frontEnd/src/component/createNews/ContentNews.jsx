import { useEffect } from "react";
import "./new.scss";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
function ContextNews(props) {
  const location = useLocation();
  const [cookies, setCookie] = useCookies(["session"]);
  const state = location.state;
  if (state) {
    setCookie("userId", state.uID);
  }
  const [id, setId] = useState();
  const [content, setContent] = useState("");
  const [imgs, setImgs] = useState([]);
  const [show, setShow] = useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(true);
  const [e, setE] = useState(false);

  useEffect(() => {
    setId(cookies.userId);
    const contentNews = document.getElementById("contentNews");
    contentNews.addEventListener("focus", () => {
      if (contentNews.textContent == "Thêm gì đó...")
        contentNews.textContent = "";
    });
    contentNews.addEventListener("blur", () => {
      if (contentNews.textContent == "")
        contentNews.textContent = "Thêm gì đó...";
    });
    contentNews.addEventListener("input", () => {
      setContent(contentNews.textContent);
    });
  }, []);
  const handleShow = () => {
    setShow(false);
  };
  useEffect(() => {
    setImgs(props.data);
  }, [props.data]);
  const handlePost = async () => {
    setLoading(true);
    const postData = {
      userID: id,
      content: content,
    };
    const formData = new FormData();
    if (imgs.length > 0) {
      try {
        const response = await axios.post(
          "http://localhost:8080/post/create",
          postData
        );
        imgs.forEach((img, index) => {
          formData.append(`image${index}`, img);
        });
        formData.append("post_id", response.data.lastID);
        await axios.post("http://localhost:8080/post/upimgs", formData);
        setSuccess(false);
      } catch (error) {
        setE(true);
        console.log(error);
      }
    } else {
      try {
        await axios.post("http://localhost:8080/post/create", postData);
        setSuccess(false);
      } catch (error) {
        setE(true);
        console.log(error);
      }
    }
    setLoading(false);
  };

  return (
    <div className="contentNews">
      <div className="contentNews-user">
        <img
          src="https://i.pinimg.com/564x/e5/40/df/e540df1eb306d103a3fd3be7e4fe2568.jpg"
          alt=""
        />
        <span className="contentNews-user-name">name space</span>
      </div>
      {/* content */}
      <div
        className="contentNews-content"
        aria-label="Viết chú thích"
        id="contentNews"
        contentEditable={success}
        suppressContentEditableWarning={true}
      >
        Thêm gì đó...
      </div>
      {/* Add */}
      {loading ? (
        <>
          <div className="spinner-grow text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <div className="spinner-grow text-secondary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <div className="spinner-grow text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <div className="spinner-grow text-danger" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <div className="spinner-grow text-warning" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </>
      ) : (
        <>
          {show ? (
            <div className="contentNews-add">
              <button
                // onClick={handleAdd}
                disabled={!content}
                type="button"
                className="btn btn-primary contentNews-add-btn"
                onClick={handleShow}
              >
                Đăng lên...
              </button>
            </div>
          ) : success ? (
            <div className="contentNews-add-select">
              <button
                disabled={!content}
                type="button"
                className="btn btn-primary"
                onClick={handlePost}
              >
                Bài viết
              </button>
              <button
                disabled={!content}
                type="button"
                className="btn btn-primary"
              >
                Tin
              </button>
            </div>
          ) : (
            <div>
              {e ? "Có lỗi xảy ra xin thử lại sau" : "đăng thành công..."}
            </div>
          )}
        </>
      )}
    </div>
  );
}
export default ContextNews;
