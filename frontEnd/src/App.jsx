import Login from "./page/login/login";
import { Routes, Route } from "react-router-dom";
import NoMath from "./page/noMath/noMath";
import Register from "./page/register/register";
import ForgotPassword from "./page/forgotPassword/forgotPassword";
import Home from "./page/home/home";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="*" element={<NoMath />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </>
  );
}

export default App;
