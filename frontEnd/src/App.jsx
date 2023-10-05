import Login from "./page/login/login";
import { Routes, Route } from "react-router-dom";
import NoMath from "./page/noMath/noMath";
import Register from "./page/register/register";
import ForgotPassword from "./page/forgotPassword/forgotPassword";
import Home from "./page/home/home";
import VerifyToken from "./page/VerifyToken/VerifyToken";
import "../style.scss";
import Timeline from "./component/timeline/Timeline";
import Profile from "./component/profile/Profile";
import Community from "./component/community/Community";
import Messenger from "./component/messenger/Messenger";
import Admin from "./component/ADMIN/Admin";
function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/register" element={<Register />} />

        <Route path="/home" element={<Home />}>
          <Route path="/home" element={<Timeline />} />
          <Route path="/home/profile" element={<Profile />} />
          <Route path="/home/community" element={<Community />} />
          <Route path="/home/messenger" element={<Messenger />} />
          <Route path="/home/admin" element={<Admin />} />
        </Route>

        <Route path="/verifyToken" element={<VerifyToken />} />
        <Route path="*" element={<NoMath />} />
      </Routes>
    </div>
  );
}

export default App;
