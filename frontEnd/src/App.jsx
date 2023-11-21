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
import SuggestFollow from "./component/profile/suggestFollow/suggestFollow";
//React Toastify

import { Toaster } from "sonner";

import "react-toastify/dist/ReactToastify.css";

import Adminn from "./component/adminBoss/adminchild/Adminc";
import Account from "./component/adminBoss/adminchild/Account";
import GroupsTable from "./component/adminBoss/adminchild/Groups";
import Posts from "./component/adminBoss/adminchild/Posts";
import PostDetail from "./component/postDetail/postDetail";
import Callvideo from "./component/callvideo/Callvideo";

import SocketContext from "./component/socketio/Socketcontext";
function App() {
  return (
    <div>
      <SocketContext>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />}>
            <Route path="/home" element={<Timeline />} />
            <Route path="/home/post/:post_id/detail" element={<PostDetail />} />
            <Route path="/home/suggestFollow" element={<SuggestFollow />} />
            <Route path="/home/profile/user/:userID" element={<Profile />} />
            <Route path="/home/community/group/:groupID" element={<Groups />} />
            <Route path="/home/profile" element={<Profile />} />
            <Route path="/home/community" element={<Community />} />
            <Route path="/home/messenger" element={<Messenger />} />
            <Route path="/home/messenger/:id" element={<Messenger />} />
            <Route path="/home/admin" element={<Adminn />}>
              <Route path="/home/admin/account" element={<Account />} />
              <Route path="/home/admin/groups" element={<GroupsTable />} />
              <Route path="/home/admin/posts" element={<Posts />} />
            </Route>
          </Route>
          <Route path="/home/messenger/:id/call" element={<Callvideo />} />
          <Route path="/verifyToken" element={<VerifyToken />} />
          <Route path="*" element={<NoMath />} />
        </Routes>
        <Toaster position="top-right" expand={false} richColors />
      </SocketContext>
    </div>
  );
}

export default App;
