import { Outlet } from "react-router-dom";
import "./home.css";
import Navigation from "../../component/navigation/Navigation";
import { useCookies } from "react-cookie";
import { io } from "socket.io-client";
import { HOST_NAME } from "../../utils/config";
import { createContext, useEffect, useState, useContext } from "react";
import { SocketCon } from "../../component/socketio/Socketcontext";
// import * as request from "../../utils/request";
export const Context = createContext();
function Home() {
  const value = useContext(SocketCon);
  const { socket, addUsers } = useContext(SocketCon);
  // const socket = value.socket;
  const [cookies] = useCookies();
  const myID = cookies.userId;

  useEffect(() => {
    const fetch = async () => {
      if (myID) {
        await new Promise((resolve) => {
          addUsers(myID);
          resolve();
        });
      }
    };
    fetch();
  }, []);
  const [play, setPlay] = useState(false);
  const click = () => {
    setPlay(!play);
  };
  return (
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
  );
}

export default Home;
