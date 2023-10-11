import { Link, Outlet } from "react-router-dom";
import "./admin.css";

function Admin() {
  return (
    <div className="admin">
      <div className="admin-nav">
        <p>Admin (quản lí)</p>
        <ul className="list-group">
          <li className="list-group-item">
            <Link to="/home/admin/account">Tài khoản</Link>
          </li>
          <li className="list-group-item">
            <Link to="">Nhóm</Link>
          </li>
          <li className="list-group-item">
            <Link to="">Bài viết</Link>
          </li>
        </ul>
      </div>
      <div className="admin-page">
        <Outlet />
      </div>
    </div>
  );
}

export default Admin;
