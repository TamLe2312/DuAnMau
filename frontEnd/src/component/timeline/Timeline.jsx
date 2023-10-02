import { useState } from "react";
import Post from "./post/Post";
import Suggestions from "./Suggestions";
import "./timeline.css";
import Tin from "./tin/Tin";

function Timeline() {
  const [posts, setPosts] = useState([
    {
      user: "play",
      time: "12h",
      img: "https://i.pinimg.com/564x/d3/44/51/d344516ca7d56f2f34a138502df97821.jpg",
      like: "100",
      title: "không có gì hot",
    },
    {
      user: "mrrsirp",
      time: "30s",
      img: "https://i.pinimg.com/736x/8c/0f/3b/8c0f3bf3abefbc649e351c2609850dc3.jpg",
      like: "60",
      title: "vip nhất thế giới",
    },
    {
      user: "top1",
      time: "90h",
      img: "https://i.pinimg.com/736x/7a/c8/28/7ac828473bbd28aa710d0291d41fb68e.jpg",
      like: "999",
      title:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    },
  ]);
  return (
    <div className=" timeline">
      <div className="timeline-post">
        <div className="timeline-tin">
          <Tin />
        </div>
        <div className="timeline-post">
          {posts.length !== 0
            ? posts.map((post) => (
                <Post
                  key={post.user}
                  user={post.user}
                  time={post.time}
                  img={post.img}
                  like={post.like}
                  title={post.title}
                />
              ))
            : "loading..."}
        </div>
      </div>
      <div className="timeline-suggestions">
        <Suggestions />
      </div>
    </div>
  );
}

export default Timeline;
