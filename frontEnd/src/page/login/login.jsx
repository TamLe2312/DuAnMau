import axios from "axios";
import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { Link, useNavigate } from "react-router-dom";
import Validation from "../../component/validation/validation";
import Logo from "../../../uploads/Logo1.png";
import * as request from "../../utils/request";
import { toast } from "sonner";
import video from "../../../public/video/bg2.mp4";
import "./login.css";
function Login() {
  const Navigate = useNavigate();
  const style = {
    margin: "0 auto",
    width: 600,
  };

  const [values, setValues] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const [cookies, setCookie] = useCookies(["session"]);
  const [checkLogin, setCheckLogin] = useState("");

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
    setError({ ...error, [e.target.name]: "" });
    setCheckLogin("");
  };
  const handleClick = async (e) => {
    e.preventDefault();
    setError(Validation(values));
    try {
      setLoading(true);
      let res = await request.post("account/login", {
        username: values.username.trim(),
        password: values.password,
      });
      // toast.success(res.data.error);
      let uID = res.data.id;
      setCookie("userId", uID);
      setLoading(false);
      Navigate("/home", { replace: true });
    } catch (error) {
      setLoading(false);
      console.error(error);
      toast.error(error.response.data.error);
      setCheckLogin(error.response.data.error);
    }
  };
  return (
    <div className="login_big">
      <video src={video} className="login_video" autoPlay loop muted></video>
      <div className="FormUser">
        <div className="FormContainerRoot">
          <div className="TitleLogoContainerForm">
            <div className="LogoImgContainerForm">
              <img src={Logo} alt="LogoFPLHub" />
            </div>
          </div>
          <form style={style} className="mt-4">
            {checkLogin && Object.keys(error).length === 6 ? (
              <p className="text-danger">{checkLogin}</p>
            ) : (
              ""
            )}
            <div className="mb-3 form-floating">
              <input
                name="username"
                placeholder="Tài khoản"
                value={values.username}
                onChange={(e) => {
                  handleChange(e);
                }}
                type="text"
                className={
                  error.username ? "form-control is-invalid" : "form-control"
                }
                id="floatingInput"
              />
              <label className="floating_val" htmlFor="floatingInput">
                Tài khoản
              </label>
              <div
                id="validationServerUsernameFeedback"
                className="invalid-feedback"
              ></div>
              {error.username && (
                <div
                  id="validationServerUsernameFeedback"
                  className="invalid-feedback"
                >
                  {error.username}
                </div>
              )}
            </div>
            <div className="mb-3 form-floating">
              <input
                placeholder="Mật khẩu"
                name="password"
                value={values.password}
                onChange={(e) => {
                  handleChange(e);
                }}
                type="password"
                className={
                  error.password ? "form-control is-invalid" : "form-control"
                }
                id="floatingPassword"
              />
              <label className="floating_val" htmlFor="floatingPassword">
                Mật khẩu
              </label>
              {error.password && (
                <div
                  id="validationServerUsernameFeedback"
                  className="invalid-feedback"
                >
                  {error.password}
                </div>
              )}
            </div>

            <button
              onClick={handleClick}
              type="submit"
              className="btn btn-primary buttonFieldFormUser"
              disabled={loading}
            >
              {loading && (
                <div
                  className="spinner-border spinner-border-sm mr-2"
                  role="status"
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
              )}
              &nbsp; Đăng nhập
            </button>
            <div className="mt-2 highlightLinkButton">
              <Link className="mt-4" to="/forgotPassword">
                Quên mật khẩu?
              </Link>
            </div>
            <div className="highlightLinkButton">
              <span>Chưa có tài khoản?</span> &nbsp;
              <Link className="mt-4" to="/register">
                Đăng kí
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
