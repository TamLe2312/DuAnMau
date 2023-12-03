import { useEffect, useState } from "react";
import "./new.scss";
import { useLocation } from "react-router-dom";
import { useCookies } from "react-cookie";
import { Context } from "../../page/home/home";
import { useContext } from "react";
import * as request from "../../utils/request";
import "ldrs/leapfrog";
// Default values shown
import * as toxic from "../vietnamToxic/VietNamToxic";
function ContextNews(props) {
  const dataa = useContext(Context);
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
  const [userData, setUserData] = useState("");
  const [viPham, setviPham] = useState(false);
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
      setviPham(false);
      setContent(contentNews.textContent);
    });
  }, []);
  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const response = await request.get(`account/getDataUser/${id}`); // Thay đổi ID tùy theo người dùng muốn lấy dữ liệu
          setUserData(response.data[0]);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };
      fetchData();
    }
  }, [id]);

  useEffect(() => {
    setImgs(props.data);
  }, [props.data]);
  const handlePost = async () => {
    const isToxic = toxic.VietNamToxic(content);
    if (isToxic) {
      console.log("vi phạm");
      setviPham(true);
    } else {
      setShow(false);
      setLoading(true);
      const postData = {
        userID: id,
        content: content,
      };
      const formData = new FormData();
      if (imgs.length > 0) {
        try {
          const response = await request.post("post/create", postData);
          imgs.forEach((img, index) => {
            formData.append(`image${index}`, img);
          });
          formData.append("post_id", response.data.lastID);
          await request.post("post/upimgs", formData);
          setSuccess(false);
        } catch (error) {
          setE(true);
          console.log(error);
        }
      } else {
        try {
          await request.post("post/create", postData);
          setSuccess(false);
        } catch (error) {
          setE(true);
          console.log(error);
        }
      }
      setLoading(false);
    }
  };

  return (
    <div className="contentNews">
      <div className="contentNews-user">
        {userData && !userData.avatar ? (
          <img
            src="https://i.pinimg.com/564x/64/b9/dd/64b9dddabbcf4b5fb2b885927b7ede61.jpg"
            alt="Avatar"
          />
        ) : (
          <img src={userData.avatar} alt="Avatar" />
        )}
        {userData && userData.name ? (
          <span className="contentNews-user-name">{userData.name}</span>
        ) : (
          <span className="contentNews-user-name">{userData.username}</span>
        )}
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
          <l-leapfrog size="40" speed="2.5" color="gray"></l-leapfrog>
        </>
      ) : (
        <>
          {show ? (
            <div className="contentNews-add-select">
              <button
                disabled={!content}
                type="button"
                className="btn btn-primary"
                onClick={handlePost}
                onMouseDown={dataa}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    dataa();
                  }
                }}
              >
                Đăng bài
              </button>
              {viPham && (
                <>
                  <br />
                  <span>Chứa từ không hợp lệ</span>
                </>
              )}
            </div>
          ) : (
            <div>
              {e ? "Có lỗi xảy ra xin thử lại sau" : "Đã đăng bài viết"}
            </div>
          )}
        </>
      )}
    </div>
  );
}
export default ContextNews;
