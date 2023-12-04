import { useEffect, useState } from "react";
import "./new.scss";
import logoImg from "../../../public/img/logoHai.jpg";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import FiberManualRecordOutlinedIcon from "@mui/icons-material/FiberManualRecordOutlined";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import ContentNews from "./ContentNews";
function ImgNews() {
  const [listi, setListi] = useState([]);
  const [imgs, setImgs] = useState([]);
  const [run, setRun] = useState(0);
  const handleFile = (e) => {
    const newImgs = [];
    const list = [];
    for (let i = 0; i < e.length; i++) {
      list.push(e[i]);
      newImgs.push(URL.createObjectURL(e[i]));
    }
    setImgs([...imgs, ...newImgs]);
    setListi([...listi, ...list]);
  };
  useEffect(() => {
    // Cleanup function
    return () => {
      imgs.map((imgUrl) => URL.revokeObjectURL(imgUrl));
    };
  }, [imgs]);
  //   slider
  const handleRun = (e) => {
    const id = e.currentTarget.id;
    const length = imgs.length;
    if (id === "left") {
      setRun((pre) => (pre === 0 ? length - 1 : pre - 1));
    } else {
      setRun((pre) => (pre === length - 1 ? 0 : pre + 1));
    }
  };
  return (
    <>
      <div className="imgNews">
        {imgs.length === 0 && (
          <>
            <input
              multiple
              id="imgNews-img"
              type="file"
              onChange={(e) => {
                handleFile(e.target.files);
              }}
            />
            <label htmlFor="imgNews-img" className="imgNews-label">
              <img src={logoImg} alt="" />
            </label>
          </>
        )}

        {imgs.length > 0 && (
          <>
            <img src={imgs[run]} alt="" />
            <span
              id="left"
              className="imgNews-left"
              onClick={(e) => handleRun(e)}
            >
              <ChevronLeftIcon sx={{ fontSize: 40 }} />
            </span>
            <span
              id="right"
              className="imgNews-right"
              onClick={(e) => handleRun(e)}
            >
              <ChevronRightIcon sx={{ fontSize: 40 }} />
            </span>
            <span className="imgNews-list-dot">
              {imgs.map((img, index) => {
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
      <ContentNews data={listi} />
    </>
  );
}
export default ImgNews;
