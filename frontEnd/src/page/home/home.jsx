import { Outlet, useLocation } from "react-router-dom";
import "./home.css";
import Navigation from "../../component/navigation/Navigation";
import { useCookies } from "react-cookie";
import { io } from "socket.io-client";

import { createContext, useEffect, useState } from "react";
export const Context = createContext();
export const userOnline = createContext();
function Home() {
  const [cookies] = useCookies();
  const myID = cookies.userId;
  const [online, setOnline] = useState([]);
  const [play, setPlay] = useState(false);
  const click = () => {
    setPlay(!play);
  };
  // useEffect(() => {
  //   const socket = io("http://localhost:8080");
  //   socket.emit("add_new_user", myID);
  //   socket.on("get_user", (userOl) => {
  //     setOnline(userOl);
  //   });
  //   return () => {
  //     socket.disconnect();
  //   };
  // }, []);
  // console.log(online);
  return (
    <userOnline.Provider value={online}>
      <Context.Provider value={click}>
        <div className="container-fluit home">
          <div className="home-nav">
            <Navigation />
          </div>
          <div className="home-timeline">
            <Outlet />
          </div>
        </div>
      </Context.Provider>
    </userOnline.Provider>
  );
}

export default Home;
