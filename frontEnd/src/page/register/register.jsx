import axios from "axios";
import React, { useState } from "react";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import Validation from "../../component/validation/validation";
import Logo from "../../../uploads/Logo1.png";
import * as request from "../../utils/request";
import "./register.css";

function Register() {
  const navigate = useNavigate();
  const style = {
    margin: "0 auto",
    width: 600,
  };

  const [values, setValues] = useState({
    username: "",
    password: "",
    email: "",
  });

  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
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
      const res = await request.post("account/register", {
        username: values.username.trim(),
        password: values.password,
        email: values.email,
      });
      toast.success(res.data.success);
      setLoading(false);
      navigate("/", { replace: true });
    } catch (error) {
      toast.error(error.response.data.error);
      setLoading(false);
      // toast.error(error.response.data.error);
    }
  };
  return (
    <>
      <div style={{ background: "#4070f4" }}>
        <div className="FormUser">
          <div className="FormContainerRoot">
            <div className="TitleLogoContainerForm">
              <div className="LogoImgContainerForm">
                <img src={Logo} alt="LogoFPLHub" />
              </div>
            </div>
            {/*  <form style={style} className="mt-4">
              <div className="mb-3">
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
                />
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
              <div className="mb-3">
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
                />
                {error.password && (
                  <div
                    id="validationServerUsernameFeedback"
                    className="invalid-feedback"
                  >
                    {error.password}
                  </div>
                )}
              </div>
              <div className="mt-2 highlightLinkButton">
                <Link className="mt-4" to="/forgotPassword">
                  Quên mật khẩu?
                </Link>
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
                Đăng nhập
              </button>
              <div className="highlightLinkButton">
                <span>Không có tài khoản?</span>
                <Link className="mt-4" to="/register">
                  Đăng kí
                </Link>
              </div>
            </form> */}
            <form style={style} className="mt-4">
              <div className="mb-3">
                <input
                  placeholder="Tài khoản"
                  name="username"
                  value={values.username}
                  onChange={(e) => {
                    handleChange(e);
                  }}
                  type="text"
                  className={
                    error.username ? "form-control is-invalid" : "form-control"
                  }
                />
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

              <div className="mb-3">
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
                />
                {error.password && (
                  <div
                    id="validationServerUsernameFeedback"
                    className="invalid-feedback"
                  >
                    {error.password}
                  </div>
                )}
              </div>
              <div className="mb-3">
                <input
                  placeholder="Email"
                  name="email"
                  value={values.email}
                  onChange={(e) => {
                    handleChange(e);
                  }}
                  type="email"
                  className={
                    error.email ? "form-control is-invalid" : "form-control"
                  }
                />
                {error.email && (
                  <div
                    id="validationServerUsernameFeedback"
                    className="invalid-feedback"
                  >
                    {error.email}
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
                Đăng ký
              </button>
              <div className="mt-2 highlightLinkButton">
                <Link className="mt-4" to="/forgotPassword">
                  Quên mật khẩu
                </Link>
              </div>
              <div className="highlightLinkButton">
                <span>Đã có tài khoản?</span>
                <Link className="mt-4" to="/">
                  Đăng nhập
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;
