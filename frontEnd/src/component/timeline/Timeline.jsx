import { createContext, useEffect, useState } from "react";
import Post from "./post/Post";
import Suggestions from "./Suggestions";
import "./timeline.css";
import Tin from "./tin/Tin";
import { Context } from "../../page/home/home";
import { useContext } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import * as request from "../../utils/request";
import Advertisement from "../advertisement/advertisement";
function Timeline() {
  const [pageData, setpageData] = useState(2);

  const data = useContext(Context);
  const [postsData, setPostsData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await request.get(`post/datapost/1`);
      if (response.status === 200) {
        const datas = response.data;
        setPostsData(datas);
      } else {
        console.log("Lỗi rồi");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [chay, setChay] = useState(false);
  useEffect(() => {
    setChay(true);
    fetchData();
    setpageData(2);
  }, [data]);
  useEffect(() => {
    const fetchDataAndSetChay = () => {
      setpageData(2);
      if (chay) {
        setTimeout(() => {
          fetchData();
          setChay(false);
        }, 1000);
      }
    };
    fetchDataAndSetChay();
  }, [chay]);
  const [adDisplayed, setAdDisplayed] = useState(false);
  const addAd = async () => {
    if (pageData > 2 && !adDisplayed && postsData.length > 4) {
      const adResponse = await request.get(`account/getDataAd`);
      const numberOfAdsToAdd = Math.floor(
        Math.random() * adResponse.data.length
      );
      const randomNum =
        Math.floor(Math.random() * (postsData.length - 5 + 1)) + 5;
      const adData = {
        id: adResponse.data[numberOfAdsToAdd].id,
        isAd: true,
        avatar: adResponse.data[numberOfAdsToAdd].avatarBrand,
        content: adResponse.data[numberOfAdsToAdd].content,
        username: adResponse.data[numberOfAdsToAdd].brand,
        created_at: adResponse.data[numberOfAdsToAdd].created_at,
      };

      setPostsData((prevPostsData) => {
        const updatedPostsData = [...prevPostsData];
        updatedPostsData.splice(randomNum, 0, adData);
        return updatedPostsData;
      });

      setAdDisplayed(true);
    }
  };

  const fetchDataNew = async () => {
    setpageData(pageData + 1);

    const response = await request.get(`post/datapost/${pageData}`);

    if (response.status === 200) {
      const datas = response.data;
      setPostsData((prevPostsData) => prevPostsData.concat(datas));
      addAd();
    } else {
      console.log("Lỗi rồi");
    }
  };

  const textEndPost = (
    <>
      Bạn đã xem hết bài viết &nbsp;
      <SentimentSatisfiedAltIcon />
    </>
  );
  const textEndPostEnd = (
    <>
      Không có bài viết nào &nbsp;
      <SentimentVeryDissatisfiedIcon />
    </>
  );
  // console.log(postsData);
  return (
    <div className=" timeline">
      <div className="timeline-post">
        <div className="timeline-tin">
          <Tin />
        </div>
        <br />
        <div className="timeline-post">
          {postsData
            ? postsData.map((post, index) => (
                <Post
                  key={index}
                  id={post.id}
                  userid={post.userid}
                  user={post.username}
                  name={post.name}
                  time={post.created_at}
                  avatar={post.avatar}
                  title={post.content}
                  isAd={post.isAd}
                  // like={100}
                />
              ))
            : "loading..."}
        </div>
        <div className="timeline-post-end">
          {postsData.length > 0 ? textEndPost : textEndPostEnd}
        </div>
      </div>
      <div className="timeline-suggestions">
        <Suggestions />
        {/*      <Advertisement /> */}
      </div>
      <InfiniteScroll
        dataLength={postsData.length + 1}
        next={fetchDataNew}
        hasMore={true}
        // loader={<h4>Loading...</h4>}
      ></InfiniteScroll>
    </div>
  );
}

export default Timeline;
