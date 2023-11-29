import "./listComment.css";
import { Avatar } from "@mui/material";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Comments from "./Comments";

import { useState } from "react";
function ListComment(props) {
  //  user(tk), , avatar, , name, id, userid
  // const img = props.img;
  // const title = props.title;
  // const avatar = props.avatar;
  // const user = props.user;
  // const name = props.name;
  const {
    name,
    user,
    userid,
    avatar,
    title,
    img,
    notification,
    unNotification,
  } = props;
  // console.log(props.handlerun);

  const [indexImg, setindexImg] = useState(0);
  const handleLeft = () => {
    if (indexImg === 0) {
      setindexImg(img.length - 1);
    } else {
      setindexImg((pre) => pre - 1);
    }
  };
  const handleRight = () => {
    if (indexImg === img.length - 1) {
      setindexImg(0);
    } else {
      setindexImg((pre) => pre + 1);
    }
  };
  return (
    <div className={img.length > 0 ? "listComments" : "listComments-notimg"}>
      {/* {console.log(img.length)} */}
      {img.length > 0 ? (
        <>
          <div className="listComment-img">
            <span className="listComment-img-length">
              {indexImg + 1}/{img.length}
            </span>
            {img.length > 1 && (
              <>
                <span className="listComment-icon-left" onClick={handleLeft}>
                  <ChevronLeftIcon sx={{ fontSize: 26 }} />
                </span>
                <span className="listComment-icon-right" onClick={handleRight}>
                  <ChevronRightIcon sx={{ fontSize: 26 }} />
                </span>
              </>
            )}
            <div className="listComment-img-imgs">
              <img
                src={
                  "http://localhost:8080/images/" +
                  (img.length === 1 ? img[0].img : img[indexImg].img)
                }
                alt=""
              />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="listComments-notimg-content">
            <div className="listComments-notimg-content-user">
              {avatar ? (
                <img src={avatar} />
              ) : (
                <img src="https://i.pinimg.com/564x/83/03/78/8303782dc3ae12a1fd72ad415ba7582c.jpg" />
              )}
              <span>{name || user}</span>
            </div>
            <div className="listComments-notimg-content-child">
              <span>{title}</span>
            </div>
          </div>
        </>
      )}
      {/* --------------------------------- */}
      <div className="listComment-comment">
        <Comments
          id={props.id}
          groupPostId={props.groupPostId}
          img={img}
          title={title}
          user={user}
          avatar={avatar}
          name={name}
          userid={userid}
          handlerun={props.handlerun}
          notification={notification}
          unNotification={unNotification}
        />
      </div>
    </div>
  );
}
export default ListComment;
