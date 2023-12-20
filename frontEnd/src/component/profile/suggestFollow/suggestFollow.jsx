import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { useCookies } from "react-cookie";
import Select from "react-select";
import * as request from "../../../utils/request";
import axios from "axios";

function SuggestFollow() {
  const [cookies] = useCookies(["session"]);
  const [loading, setLoading] = useState(false);
  const [dataSuggestFollow, setDataSuggestFollow] = useState([]);
  const [dataFindArena, setDataFindArena] = useState([]);

  const idUser = cookies.userId;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await request.get(
          `account/suggestFollow/${idUser}&20`
        );
        setLoading(false);
        setDataSuggestFollow(response.data);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching user data:", error);
      }
    };
    fetchData();
  }, [idUser]);

  const handleAdd = async (id) => {
    try {
      let res = await request.post("account/followUser", {
        follower_id: idUser,
        followed_id: id,
      });
      if (res.data.success) {
        toast.success(res.data.success);
        if (dataFindArena.length > 0) {
          setDataFindArena((prevData) =>
            prevData.map((data) => {
              if (data.id === id) {
                return { ...data, isFollow: true };
              } else {
                return data;
              }
            })
          );
        }
        setDataSuggestFollow((prevData) =>
          prevData.map((data) => {
            if (data.id === id) {
              return { ...data, isFollow: true };
            } else {
              return data;
            }
          })
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemove = async (id) => {
    try {
      let res = await request.post("account/unfollowUser", {
        follower_id: idUser,
        followed_id: id,
      });
      if (res.data.success) {
        toast.success(res.data.success);
        if (dataFindArena.length > 0) {
          setDataFindArena((prevData) =>
            prevData.map((data) => {
              if (data.id === id) {
                return { ...data, isFollow: false };
              } else {
                return data;
              }
            })
          );
        }
        setDataSuggestFollow((prevData) =>
          prevData.map((data) => {
            if (data.id === id) {
              return { ...data, isFollow: false };
            } else {
              return data;
            }
          })
        );
      }
    } catch (error) {
      console.error(error);
    }
  };
  const [provinceSelect, setProvinceSelect] = useState([]);
  const [districtSelect, setDistrictSelect] = useState([]);
  const [wardsSelect, setWardsSelect] = useState([]);
  const [province, setProvince] = useState(null);
  const [district, setDistrict] = useState(null);
  const [wards, setWards] = useState(null);
  useEffect(() => {
    const ProvinceSelect = async () => {
      const res = await axios.get("https://provinces.open-api.vn/api/?depth=3");
      if (res) {
        const updateProvinceSelect = res.data.map((item) => ({
          value: item.name,
          label: item.name,
          huyen: item.districts,
        }));
        console.log(updateProvinceSelect);
        setProvinceSelect(updateProvinceSelect);
      }
      return () => {};
    };
    ProvinceSelect();
  }, []);
  useEffect(() => {
    if (province) {
      const updateDistrict = province.huyen.map((item) => ({
        value: item.name,
        label: item.name,
        xa: item.wards,
      }));
      setDistrictSelect(updateDistrict); // Corrected function name
    }
  }, [province]);

  useEffect(() => {
    if (district) {
      const updateWards = district.xa.map((item) => ({
        value: item.name,
        label: item.name,
      }));
      setWardsSelect(updateWards);
    }
  }, [district]);
  const handleFindArena = async () => {
    let address = "";

    if (wards) {
      address += wards.value;
    }

    if (district) {
      address += " " + district.value;
    }

    if (province) {
      address += " " + province.value;
    }
    address = address.toLowerCase();

    if (province || district || wards) {
      try {
        const res = await request.post(`account/findArena`, {
          id: idUser,
          address: address,
        });
        if (!res.data.length) {
          toast.error("Không tìm thấy người dùng ở khu vực bạn đang tìm");
          setDataFindArena([]);
        } else {
          toast.success("Tìm thành công");
          const updatedData = res.data.map((item) => ({
            ...item,
            isFollow: false,
          }));
          setDataFindArena(updatedData);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };
  const handleResetFind = () => {
    setProvince(null);
    setDistrict(null);
    setWards(null);
    setDistrictSelect([]);
    setWardsSelect([]);
    setDataFindArena([]);
  };
  return (
    <>
      <div className="container suggestFollowContainer">
        <div className="ProfileFollowSuggestContainer">
          <div className="ProfileFollowSuggestForYou">
            <span>Gợi ý cho bạn</span>
          </div>
          <div className="FindArena">
            <Select
              options={provinceSelect}
              value={province}
              onChange={(e) => setProvince(e)}
            />
            <Select
              options={districtSelect}
              value={district}
              onChange={(e) => setDistrict(e)}
            />
            <Select
              options={wardsSelect}
              value={wards}
              onChange={(e) => setWards(e)}
            />
            {dataFindArena && dataFindArena.length > 0 ? (
              <button
                className="btn btn-primary mt-2"
                onClick={handleResetFind}
              >
                <i className="fa-solid fa-arrow-rotate-right"></i>
              </button>
            ) : (
              <button
                className="btn btn-primary mt-2"
                onClick={handleFindArena}
              >
                <i className="fa-solid fa-magnifying-glass"></i>
              </button>
            )}
          </div>
          <div>
            <div style={{ height: "auto", overflow: "hidden auto" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  paddingBottom: 0,
                  paddingTop: 0,
                  position: "relative",
                }}
              >
                {loading ? (
                  <div className="ProfileFollowRowContent">
                    <span>Loading....</span>
                  </div>
                ) : dataFindArena && dataFindArena.length > 0 ? (
                  dataFindArena.map((data, index) => {
                    return (
                      <div className="ProfileFollowRowContent" key={index}>
                        <div className="ProfileFollowImgContent">
                          {data.avatar ? (
                            <img
                              src={data.avatar}
                              alt={data.name ? data.name : data.username}
                            />
                          ) : (
                            <img src="https://i.pinimg.com/564x/64/b9/dd/64b9dddabbcf4b5fb2b885927b7ede61.jpg" />
                          )}
                        </div>
                        <span>{data.name ? data.name : data.username}</span>
                        {data.isFollow ? (
                          <button onClick={() => handleRemove(data.id)}>
                            Unfollow
                          </button>
                        ) : (
                          <button onClick={() => handleAdd(data.id)}>
                            Follow
                          </button>
                        )}
                      </div>
                    );
                  })
                ) : dataSuggestFollow && dataSuggestFollow.length > 0 ? (
                  dataSuggestFollow.map((data, index) => {
                    return (
                      <div className="ProfileFollowRowContent" key={index}>
                        <div className="ProfileFollowImgContent">
                          {data.avatar ? (
                            <img
                              src={data.avatar}
                              alt={data.name ? data.name : data.username}
                            />
                          ) : (
                            <img src="https://i.pinimg.com/564x/64/b9/dd/64b9dddabbcf4b5fb2b885927b7ede61.jpg" />
                          )}
                        </div>
                        <span>{data.name ? data.name : data.username}</span>
                        {data.isFollow ? (
                          <button onClick={() => handleRemove(data.id)}>
                            Unfollow
                          </button>
                        ) : (
                          <button onClick={() => handleAdd(data.id)}>
                            Follow
                          </button>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="ProfileFollowRowContent">
                    <span>Hiện tại không có gợi ý theo dõi nào</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SuggestFollow;
