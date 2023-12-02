import React, { useEffect, useState } from "react";
import Select from "react-select";
import axios from "axios";
const Test = () => {
  const [tinhv, settinhv] = useState([]);
  const [huyenv, setHuyenv] = useState([]);
  const [xav, setxav] = useState([]);
  useEffect(() => {
    const tinh = async () => {
      const res = await axios.get("https://provinces.open-api.vn/api/?depth=3");
      if (res) {
        const updatedTinhv = res.data.map((item) => ({
          value: item.name,
          label: item.name,
          huyen: item.districts,
        }));
        settinhv(updatedTinhv);
      }
      return () => {};
    };
    tinh();
  }, []);
  const [tinh, setTinh] = useState(null);
  const [huyen, setHuyen] = useState(null);
  const [xa, setXa] = useState(null);
  const [a, setA] = useState("Đăk nông");
  const [b, setB] = useState("Cư jut");
  const [c, setC] = useState("Epo");
  const [an, setan] = useState(false);

  useEffect(() => {
    if (tinh) {
      setA(tinh.value);
      const updateHuyen = tinh.huyen.map((item) => ({
        value: item.name,
        label: item.name,
        xa: item.wards,
      }));
      setHuyenv(updateHuyen);
    }
  }, [tinh]);
  useEffect(() => {
    if (huyen) {
      setB(huyen.value);
      const updateXa = huyen.xa.map((item) => ({
        value: item.name,
        label: item.name,
      }));
      setxav(updateXa);
    }
  }, [huyen]);
  useEffect(() => {
    if (xa) {
      setC(xa);
    }
  }, [xa]);

  // chạy
  const handleAn = () => {
    setan(true);
  };
  const handleHuy = () => {
    setan(false);
    setTinh(null);
    setHuyen(null);
    setXa(null);
    setA("Đăk nông");
    setB("Cư jut");
    setC("Nam dong");
  };
  const handleLogin = () => {
    if (tinh && huyen && xa) {
      setan(false);
      let diaCHi = xa + ", " + huyen.value + ", " + tinh.value;
      console.log(diaCHi);
    } else {
      console.log("Chưa nhập thông tin");
    }
  };
  const myst = {
    fontSize: ".9rem",
    color: "gray",
  };
  return (
    <>
      <div className="vietnam">
        <div className="vietnam_item">
          {an ? (
            <Select options={tinhv} onChange={(e) => setTinh(e)} />
          ) : (
            <label onClick={handleAn}>
              {a} <span style={myst}>(Edit)</span>
            </label>
          )}
        </div>
        <div className="vietnam_item">
          {an ? (
            <>
              <Select options={huyenv} onChange={(e) => setHuyen(e)} />
            </>
          ) : (
            <label>{b}</label>
          )}
        </div>
        <div className="vietnam_item">
          {an ? (
            <>
              <Select options={xav} onChange={(e) => setXa(e.value)} />
              <span onClick={handleHuy}>Hủy</span>
            </>
          ) : (
            <label>{c}</label>
          )}
        </div>
      </div>
      {tinh && huyen && xa && (
        <button className="btn btn-success mt-2" onClick={handleLogin}>
          Đăng kí
        </button>
      )}
    </>
  );
};

export default Test;
