import "./navigation.css";
import { NavLink } from "react-router-dom";
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

function Navigation() {
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
  });

  const [size, setSize] = useState(window.innerWidth);
  const [showSiteBar, setShowSiteBar] = useState(false);
  useEffect(() => {
    const handleSile = () => {
      setSize(window.innerWidth);
    };
    window.addEventListener("resize", handleSile);
    return () => {
      window.removeEventListener("resize", handleSile);
    };
  }, []);

  return (
    <div className="navigation">
      {/* <h2>{size}</h2> */}
      <a href="#">
        <img
          className="navigation-logo"
          src="https://www.docschmidt.org/uploads/1/4/3/0/143018339/print-204012274_orig.jpg"
          alt=""
        />
      </a>
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

      <button className="navigation-button">
        <AddToPhotosIcon />
        <span>Tạo</span>
      </button>
      <NavLink className="navigation-button" to={"/home/profile"}>
        <img
          className="navigation-button-img"
          src="https://i.pinimg.com/564x/85/ac/d4/85acd43486608fa7f3edc5df40e9f268.jpg"
          alt=""
        />
        <span>Trang cá nhân</span>
      </NavLink>

      <div ref={menuRef}>
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
            <div onClick={handleMode}>
              <Drop
                Title={"Chuyển chế độ"}
                icon={mode ? <WbSunnyIcon /> : <DarkModeIcon />}
              />
            </div>
            <Drop text={"Đăng xuất"} path={""} icon={<LogoutIcon />} />
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
    </div>
  );
}

export default Navigation;

function Drop(props) {
  return (
    <li className="dopItem">
      {props.Title}
      <a href={"/" + props.path}>{props.text}</a>
      {props.icon}
    </li>
  );
}
