import { Link } from "react-router-dom";
import "./noMath.css";
function NoMath() {
  return (
    <div className="page_notfound">
      <h1>404</h1>
      <span className="mb-2">Trang không tồn tại</span>
      <div>
        <Link className="btn btn-secondary" to="/home">
          Trang chủ
        </Link>
      </div>
    </div>
  );
}

export default NoMath;
