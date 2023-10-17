import { Outlet, useLocation } from "react-router-dom";
import "./home.css";
import Navigation from "../../component/navigation/Navigation";
import { createContext, useState } from "react";

export const Context = createContext();
function Home() {
  // const location = useLocation();
  // const userID = location.state;
  // console.log(userID);
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
