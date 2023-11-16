import { Await, Outlet, useLocation } from "react-router-dom";
import "./home.css";
import Navigation from "../../component/navigation/Navigation";
import { useCookies } from "react-cookie";
import { io } from "socket.io-client";
import { HOST_NAME } from "../../utils/config";
import { createContext, useEffect, useState } from "react";
import * as request from "../../utils/request";
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
  const socket = io(HOST_NAME);
  useEffect(() => {
    const fetch = async () => {
      await socket.emit("add_ols", myID);
      // socket.on("get_ol", (userOl) => {
      //   setOnline(userOl);
      // });
      // socket.on("recibir", (data) => {
      //   console.log(data);
      // });
    };
    fetch();
  }, []);
  return (
    <userOnline.Provider value={{ online, socket }}>
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
