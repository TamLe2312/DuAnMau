import { Outlet, useLocation } from "react-router-dom";
import { useCookies } from "react-cookie";
import "./home.css";
import Navigation from "../../component/navigation/Navigation";
import { createContext, useState } from "react";
export const Context = createContext();
function Home() {
  const location = useLocation();
  const [cookies, setCookie] = useCookies(["session"]);
  const state = location.state;
  if (state) {
    setCookie("userId", state.uID);
  }
  const [play, setPlay] = useState(false);
  const click = () => {
    setPlay(!play);
  };
  // console.log(play);
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
