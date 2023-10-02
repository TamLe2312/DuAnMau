import { useEffect } from "react";
import "./new.scss";
import { useState } from "react";

function ContextNews() {
  const [content, setContent] = useState("");
  const [show, setShow] = useState(true);
  useEffect(() => {
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
  // const handleAdd = () => {
  //   console.log(content.trim());
  // };
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
        contentEditable="true"
        suppressContentEditableWarning={true}
      >
        Thêm gì đó...
      </div>
      {/* Add */}
      {show ? (
        <div className="contentNews-add">
          <button
            // onClick={handleAdd}
            disabled={!content}
            type="button"
            className="btn btn-primary contentNews-add-btn"
            onClick={() => setShow(false)}
          >
            Đăng lên...
          </button>
        </div>
      ) : (
        <div className="contentNews-add-select">
          <button disabled={!content} type="button" className="btn btn-primary">
            Bài viết
          </button>
          <button disabled={!content} type="button" className="btn btn-primary">
            Tin
          </button>
        </div>
      )}
    </div>
  );
}
export default ContextNews;
