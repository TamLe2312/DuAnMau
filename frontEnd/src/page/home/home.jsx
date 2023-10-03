import { Outlet, useLocation } from "react-router-dom";
import { useCookies } from "react-cookie";
import "./home.css";
import Navigation from "../../component/navigation/Navigation";

function Home() {
  const location = useLocation();
  const [cookies, setCookie] = useCookies(["session"]);
  const state = location.state;
  if (state) {
    setCookie("userId", state.uID);
  }

  return (
    <div className="container-fluit home">
      <div className="home-nav">
        <Navigation />
      </div>
      <div className="home-timeline">
        <Outlet />
      </div>
    </div>
  );
}

export default Home;
