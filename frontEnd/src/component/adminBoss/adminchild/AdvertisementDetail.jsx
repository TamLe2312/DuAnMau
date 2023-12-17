import React from "react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./adComment.scss";
import request from "../../../utils/request";
const AdvertisementDetail = () => {
  // lấy giá trị từ đường dẫn
  const location = useLocation();
  const adDetail = location.state;
  const [imgs, setImgs] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await request.get(`account/getAdImgs/${adDetail.id}`);
        setImgs(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);
  return (
    <>
      <div className="container-fluit comment_ad">
        <Link
          className="btn btn-outline-primary"
          to="/home/admin/advertisement"
        >
          <i className="fa-regular fa-circle-left"></i> Quay lại
        </Link>
        <div className="user_comment_ad mt-4 mb-4">
          {adDetail && (
            <>
              <span className="text-primary">{adDetail.brand}: </span>
              <span>{adDetail.content}</span>
            </>
          )}
        </div>
        <div className="row ">
          <div className="col-md-3">
            <ul className="list-group comment_ad_listmenu">
              <li className="list-group-item list-group-item-action comment_aitem">
                Ảnh
              </li>
            </ul>
          </div>
          {/* sử lí ở đây */}
          <div className="col-md-9">
            {imgs && imgs.length > 0 ? (
              <div className="commentAd_listimg">
                {imgs.map((item, index) => (
                  <img
                    key={index}
                    className="commentAd_img"
                    src={item.img}
                    alt=""
                  />
                ))}
              </div>
            ) : (
              <div>Bài viết không có hình ảnh</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdvertisementDetail;
