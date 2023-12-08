import { useEffect, useState } from "react";
import request from "../../utils/request";

function Advertisement() {
  const [ad, setAd] = useState([]);
  useEffect(() => {
    const GetDataAd = async () => {
      try {
        const res = await request.get(`account/getDataAd`);
        setAd(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    GetDataAd();
  }, []);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentAdIndex((prevIndex) =>
        prevIndex === ad.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    // Xóa interval khi component unmount
    return () => clearInterval(intervalId);
  }, [ad]);
  return (
    <>
      {ad && ad.length > 0 && (
        <div className="suggestFollowAdvertisement">
          <img src={ad[currentAdIndex]?.img} alt={ad[currentAdIndex]?.brand} />
        </div>
      )}
    </>
  );
}
export default Advertisement;
