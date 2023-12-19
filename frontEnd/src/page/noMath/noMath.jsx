import { Link } from "react-router-dom";
import "./noMath.css";
import video from "../../../public/video/bg2.mp4";

function NoMath() {
  return (
    <div className="page_notfound">
      <video src={video} className="login_video" autoPlay loop muted></video>
      <h1>404</h1>
      <span className="mb-2">Trang không tồn tại</span>
      <div>
        <Link className="btn btn-secondary mt-2" to="/home">
          Trang chủ
        </Link>
      </div>
    </div>
  );
}

export default NoMath;
