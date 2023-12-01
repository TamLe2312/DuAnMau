import { Link, NavLink, Outlet } from "react-router-dom";
import "./admin.css";

function Adminn() {
  return (
    <div className="admin">
      <div className="admin-nav">
        <Link to="/home">Home</Link>
        <p>Admin (quản lí)</p>
        <ul className="list-group">
          <li className="list-group-item admin_children">
            <NavLink to="/home/admin/account">Tài khoản</NavLink>
          </li>
          <li className="list-group-item admin_children">
            <NavLink to="/home/admin/groups">Nhóm</NavLink>
          </li>
          <li className="list-group-item admin_children">
            <NavLink to="/home/admin/posts">Bài viết</NavLink>
          </li>
          <li className="list-group-item admin_children">
            <NavLink to="/home/admin/test">Thêm</NavLink>
          </li>
        </ul>
      </div>
      <div className="admin-page">
        <Outlet />
      </div>
    </div>
  );
}

export default Adminn;
