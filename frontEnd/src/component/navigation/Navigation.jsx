import "./navigation.css";
import axios from "axios";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Offcanvas from "react-bootstrap/Offcanvas";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import PeopleIcon from "@mui/icons-material/People";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import AddToPhotosIcon from "@mui/icons-material/AddToPhotos";
import MenuIcon from "@mui/icons-material/Menu";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Search from "../sreach/Sreach";
import Notification from "../notification/Notification";
import LogoutIcon from "@mui/icons-material/Logout";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import MyModal from "../modal/Modal";
import ImgNews from "../createNews/ImgNews";
import ContentNews from "../createNews/ContentNews";
import { useCookies } from "react-cookie";
import imageLogo from "../../../uploads/Logo1.png";

function Navigation() {
  const Navigate = useNavigate();
  const [userData, setUserData] = useState("");
  const [cookies, removeCookie] = useCookies(["session"]);
  const id = cookies.userId;
  // console.log("chủ: " + id);

  const [show, setShow] = useState(false);
  const [checkS, setCheckS] = useState("");
  const [showMore, setShowMore] = useState(false);
  const [mode, setMode] = useState(false);
  const handleClose = () => setShow(false);
  const toggleShow = (e) => {
    setShow((s) => !s);
    setCheckS(e.currentTarget.id);
  };
  const handleShowMore = () => {
    setShowMore(!showMore);
  };
  const handleMode = () => {
    setMode(!mode);
  };
  const menuRef = useRef();
  useEffect(() => {
    const handleOutMore = (e) => {
      if (!menuRef.current.contains(e.target)) {
        setShowMore(false);
      }
    };
    document.addEventListener("mousedown", handleOutMore);
    return () => {
      document.removeEventListener("mousedown", handleOutMore);
    };
  }, []);
  const [modalShow, setModalShow] = useState(false);

  const handleHide = () => {
    setModalShow(false);
  };
  const logout = (
    <>
      <span className="dropdown-span"> Đăng xuất </span>&nbsp;
      <LogoutIcon />
    </>
  );
  const admin = (
    <>
      <span className="dropdown-span"> ADMIN</span> &nbsp;
      <AdminPanelSettingsIcon />
    </>
  );
  const theme = (
    <>
      <span className="dropdown-span">Giao diện</span>&nbsp;{" "}
      {mode ? <WbSunnyIcon /> : <DarkModeIcon />}
    </>
  );
  const handleLogout = () => {
    removeCookie("userId");
    Navigate("/", { replace: true });
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/account/getDataUser/${id}`
        ); // Thay đổi ID tùy theo người dùng muốn lấy dữ liệu
        setUserData(response.data[0]);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchData();
  }, [id]);
  return (
    <div className="navigation">
      <Link to="/home">
        <img className="navigation-logo" src={imageLogo} alt="" />
      </Link>
      <NavLink className="navigation-button" to={"/home"} end>
        <HomeIcon />
        <span>Trang chủ</span>
      </NavLink>
      <button
        className="navigation-button"
        onClick={(e) => toggleShow(e)}
        id="tim-kiem"
      >
        <SearchIcon />
        <span>Tìm kiếm</span>
      </button>
      <NavLink className="navigation-button" to={"/home/community"}>
        <PeopleIcon />
        <span>Cộng đồng</span>
      </NavLink>
      <NavLink className="navigation-button" to={"/home/messenger"}>
        <ChatBubbleIcon />
        <span>Tin nhắn</span>
      </NavLink>
      <button
        className="navigation-button"
        onClick={(e) => toggleShow(e)}
        id="thong-bao"
      >
        <FavoriteIcon />
        <span>Thông báo</span>
      </button>
      <button
        className="navigation-button"
        onClick={() => {
          setModalShow(true);
        }}
      >
        <AddToPhotosIcon />
        <span>Tạo</span>
      </button>
      <NavLink className="navigation-button" to={`/home/profile`} end>
        {userData && !userData.avatar ? (
          <img
            className="navigation-button-img"
            src="https://i.pinimg.com/564x/64/b9/dd/64b9dddabbcf4b5fb2b885927b7ede61.jpg"
            alt="Avatar"
          />
        ) : (
          <img
            className="navigation-button-img"
            src={userData.avatar}
            alt="Avatar"
          />
        )}
        <span>Trang cá nhân</span>
      </NavLink>
      <div ref={menuRef} className="navigation-button-father">
        <button
          className="navigation-button navigation-button-more"
          onClick={handleShowMore}
        >
          <MenuIcon />
          <span>Xem thêm</span>
        </button>

        {/* {showMore && ( */}
        <div className={`dropdown-more ${showMore ? "active" : "inactive"}`}>
          <ul className="dropdown-more-ul">
            <Drop text={admin} path={"home/admin"} />
            <div onClick={handleMode} className="dropdown-more-title">
              <Drop Title={theme} />
            </div>
            <div onClick={handleLogout} className="dropdown-more-title">
              <Drop Title={logout} path={""} />
            </div>
          </ul>
        </div>
      </div>
      {/* )} */}
      {/* Offcanvas */}
      <Offcanvas show={show} onHide={handleClose} scroll={true} backdrop={true}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            {checkS === "tim-kiem" ? "Tìm kiếm" : "Thông báo"}
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {/* body */}
          {checkS === "tim-kiem" ? <Search /> : <Notification />}
        </Offcanvas.Body>
      </Offcanvas>
      <MyModal
        text={"Tạo bài viết"}
        show={modalShow}
        onHide={handleHide}
        childrens={<ImgNews />}
      />
    </div>
  );
}

export default Navigation;
// &nbsp;
function Drop(props) {
  return (
    <li className="dopItem">
      {props.Title}
      <Link to={"/" + props.path}>{props.text}</Link>
      {props.icon}
    </li>
  );
}
