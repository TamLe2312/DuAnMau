import axios from "axios";
import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { Link, useNavigate } from "react-router-dom";
import Validation from "../../component/validation/validation";

import { toast } from "sonner";

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
  const [cookies, setCookie] = useCookies(["userId"]);
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
      let res = await axios.post("http://localhost:8080/account/login", {
        username: values.username.trim(),
        password: values.password,
      });
      toast.success(res.data.error);
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
  // console.log(error);
  return (
    <>
      <form style={style} className="mt-4">
        <h3>Login</h3>
        {checkLogin && Object.keys(error).length === 6 ? (
          <p className="text-danger">{checkLogin}</p>
        ) : (
          ""
        )}
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input
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
          <label className="form-label">Password</label>
          <input
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

        <button
          onClick={handleClick}
          type="submit"
          className="btn btn-primary"
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
          &nbsp;Login
        </button>

        <div className="mt-2">
          <Link className="mt-4" to="/forgotPassword">
            Quên mật khẩu
          </Link>
        </div>
        <div>
          <Link className="mt-4" to="/register">
            Đăng kí
          </Link>
        </div>
      </form>
    </>
  );
}

export default Login;
