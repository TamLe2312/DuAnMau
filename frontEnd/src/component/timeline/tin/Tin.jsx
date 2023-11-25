import { useState } from "react";
import "./tin.css";
function Tin() {
  const [dataNews, setDataNews] = useState([
    {
      avatar:
        "https://i.pinimg.com/564x/d9/b7/3f/d9b73ffbb73926f82ee9d476867d2093.jpg",
      nameNews: "1",
    },
    {
      avatar:
        "https://i.pinimg.com/564x/e0/f2/0e/e0f20e859efce39b93857f603cc86d49.jpg",
      nameNews: "2",
    },
    {
      avatar:
        "https://i.pinimg.com/564x/ed/6d/9d/ed6d9d7e6a37b1d316698d0189e25677.jpg",
      nameNews: "3",
    },
    {
      avatar:
        "https://i.pinimg.com/564x/86/63/41/8663419dda5ba694e8bfcd96d81a85b7.jpg",
      nameNews: "4",
    },
    {
      avatar:
        "https://i.pinimg.com/564x/3b/1c/90/3b1c90fe274217a44d9619de82012884.jpg",
      nameNews: "5",
    },
    {
      avatar:
        "https://i.pinimg.com/564x/3b/1c/90/3b1c90fe274217a44d9619de82012884.jpg",
      nameNews: "6",
    },
    {
      avatar:
        "https://i.pinimg.com/564x/3b/1c/90/3b1c90fe274217a44d9619de82012884.jpg",
      nameNews: "7",
    },
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const totalNews = dataNews.length;
  const displayNews = dataNews.slice(currentIndex, currentIndex + 5);

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex + 5 < totalNews ? prevIndex + 5 : prevIndex
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 5 >= 0 ? prevIndex - 5 : 0));
  };
  return (
    <div className="tin">
      <i
        className="fa-solid fa-chevron-left NewsPrevButton"
        onClick={handlePrev}
      ></i>

      {displayNews && displayNews.length > 0
        ? displayNews.map((data, index) => (
            <div className="tin-group" key={index}>
              <img className="tin-group-img" src={data.avatar} alt="Test" />
              <span className="tin-group-name">{data.nameNews}</span>
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
