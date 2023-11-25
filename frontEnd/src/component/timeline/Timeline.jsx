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
  const fetchDataNew = () => {
    setpageData(pageData + 1);
    const dataNew = async () => {
      const response = await request.get(`post/datapost/${pageData}`);
      if (response.status === 200) {
        const datas = response.data;
        setPostsData(postsData.concat(datas));
      } else {
        console.log("Lỗi rồi");
      }
    };
    dataNew();
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
