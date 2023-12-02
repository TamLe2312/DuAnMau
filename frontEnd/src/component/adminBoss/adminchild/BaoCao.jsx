import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import moment from "moment";

export const BaoCao = () => {
  const location = useLocation();
  const postDetail = location.state;
  const [flag, setflag] = useState([]);
  const format = (time) => {
    let currentDate = moment(time).format("MMMM Do YYYY, h:mm:ss a");
    return currentDate;
  };
  return (
    <>
      {/* {flag.length > 0 ? ( */}
      <table className="table table-hover">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Người báo cáo</th>
            <th scope="col">Lí do</th>
            <th scope="col">Thời gian</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">1</th>
            <td>Mark</td>
            <td>Otto</td>
            <td>12h</td>
          </tr>
        </tbody>
      </table>
      {/* ) : (
        "Chưa có phản hồi nào cho bài viết này"
      )} */}
    </>
  );
};
