import { Outlet } from "react-router-dom";
import "./home.css";
import Navigation from "../../component/navigation/Navigation";

function Home() {
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
