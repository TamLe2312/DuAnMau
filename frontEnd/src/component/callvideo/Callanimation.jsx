import { useEffect, useState } from "react";
import "./modalvideo.css";
const Callanimation = (props) => {
  const [emojiss, setemojis] = useState([]);
  useEffect(() => {
    const emoji = props.emoji;
    const emojis = new Array(10).fill(emoji);
    setemojis(emojis);
  }, []);

  return (
    <div className="wrapper">
      {emojiss.map((item, index) => (
        <span key={index}>
          <i className={item}></i>
        </span>
      ))}
    </div>
  );
};

export default Callanimation;
