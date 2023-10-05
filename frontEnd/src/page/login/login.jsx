import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Validation from "../../component/validation/validation";
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
      let uID = res.data.id;
      setLoading(false);
      Navigate("/home", { state: { uID } }, { replace: true });
    } catch (error) {
      setLoading(false);
      setCheckLogin(error.response.data.error);
    }
  };

  return (
    <>
      <form style={style} className="mt-4">
        <h3>Login</h3>
        {checkLogin && Object.keys(error).length === 1 ? (
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
            Quyên mật khẩu
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