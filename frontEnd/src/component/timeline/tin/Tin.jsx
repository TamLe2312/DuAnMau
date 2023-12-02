import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "./tin.css";
import request from "../../../utils/request";
function Tin() {
  const [dataNews, setDataNews] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const totalNews = dataNews.length;
  const displayNews =
    currentIndex === 0
      ? dataNews.slice(0, 4) // Bao gồm cả tạo tin
      : dataNews.slice(currentIndex, currentIndex + 4);

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex + 4 < totalNews ? prevIndex + 4 : prevIndex
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 4 >= 0 ? prevIndex - 4 : 0));
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await request.get(`post/getDataNews`);
        setDataNews(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="tin">
      <i
        className="fa-solid fa-chevron-left NewsPrevButton"
        onClick={handlePrev}
      ></i>
      {currentIndex === 0 && (
        <div className="tin-group-new-container">
          <Link to="/stories/create">
            <div className="tin-group">
              <div className="tin-group-new">
                <i className="fa-solid fa-plus"></i>
              </div>
              <span className="tin-group-name">Tạo tin</span>
            </div>
          </Link>
        </div>
      )}
      {displayNews && displayNews.length > 0
        ? displayNews.map((data, index) => (
            <div className="tin-group" key={index}>
              <Link to={`/stories/${data.user_id}`}>
                <img
                  className="tin-group-img"
                  src={
                    data.avatar
                      ? data.avatar
                      : "https://i.pinimg.com/564x/64/b9/dd/64b9dddabbcf4b5fb2b885927b7ede61.jpg"
                  }
                  alt="Test"
                />
              </Link>
              <span className="tin-group-name">
                {data.name ? data.name : data.username}
              </span>
            </div>
          ))
        : null}
      <i
        className="fa-solid fa-chevron-right NewsNextButton"
        onClick={handleNext}
      ></i>
    </div>
  );
}

export default Tin;
