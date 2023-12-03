import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import moment from "moment";
import * as postService from "../../../services/AdPostService";

export const BaoCao = () => {
  const location = useLocation();
  const postDetail = location.state;
  const [flag, setflag] = useState([]);
  useEffect(() => {
    const fetchFlag = async () => {
      const res = await postService.listFlagPost(postDetail.id);
      setflag(res);
    };
    fetchFlag();
    return () => {};
  }, []);
  const format = (time) => {
    let currentDate = moment(time).format("MMMM Do YYYY, h:mm:ss a");
    return currentDate;
  };
  return (
    <>
      {flag.length > 0 ? (
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
            {flag.map((item, index) => (
              <tr key={index}>
                <th scope="row">{index + 1}</th>
                <td>{item.name ?? item.username}</td>
                <td>{item.flagcontent}</td>
                <td>{format(item.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        "Chưa có phản hồi nào cho bài viết này"
      )}
    </>
  );
};
