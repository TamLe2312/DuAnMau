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
import Groups from "./component/group/Groups";

//React Toastify
import { Toaster } from 'sonner'
import "react-toastify/dist/ReactToastify.css";
import Admin from "./component/ADMIN/Admin";
import Account from "./component/ADMIN/adminchild/account";
function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/register" element={<Register />} />

        <Route path="/home" element={<Home />}>
          <Route path="/home" element={<Timeline />} />
          <Route path="/home/profile/user/:userID" element={<Profile />} />
          <Route path="/home/community/group/:groupID" element={<Groups />} />
          <Route path="/home/profile" element={<Profile />} />
          <Route path="/home/community" element={<Community />} />
          <Route path="/home/messenger" element={<Messenger />} />
          <Route path="/home/admin" element={<Admin />}>
            <Route path="/home/admin/account" element={<Account />} />
          </Route>
        </Route>
        <Route path="/verifyToken" element={<VerifyToken />} />
        <Route path="*" element={<NoMath />} />
      </Routes>
      <Toaster position="top-right" expand={false} richColors />

    </div>
  );
}

export default App;
