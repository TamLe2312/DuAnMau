import "./listComment.css";
import { Avatar } from "@mui/material";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Comments from "./Comments";
import { useState } from "react";
function ListComment(props) {
  //  user(tk), , avatar, , name, id, userid
  const img = props.img;
  const title = props.title;
  const avatar = props.avatar;
  const user = props.user;
  const name = props.name;
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
      {img.length > 0 ? (
        <>
          <div className="listComment-img">
            <span className="listComment-img-length">
              {indexImg + 1}/{img.length}
            </span>
            <span className="listComment-icon-left" onClick={handleLeft}>
              <ChevronLeftIcon sx={{ fontSize: 26 }} />
            </span>
            <span className="listComment-icon-right" onClick={handleRight}>
              <ChevronRightIcon sx={{ fontSize: 26 }} />
            </span>
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
                <Avatar>
                  {name !== null ? name.charAt(0) : user.charAt(0)}
                </Avatar>
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
          handlerun={props.handlerun}
        />
      </div>
    </div>
  );
}
export default ListComment;
