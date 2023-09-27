import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import './login.css'

function Login() {
  const Navigate = useNavigate();
  const style = {
    margin: "0 auto",
    width: 600,
  };

  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [checkU, setCheckU] = useState(false);
  const [checkP, setCheckP] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkLogin, setCheckLogin] = useState("");
  const [checked, setChecked] = useState(true);
  const handleClick = async (e) => {
    e.preventDefault();
    if (!username) {
      setCheckU(true);
      return;
    }
    if (!password) {
      setCheckP(true);
      return;
    }
    try {
      setLoading(true);
      await axios.post("http://localhost:8080/account/login", {
        username,
        password,
      });
      setLoading(false);

      Navigate("/home", { replace: true });
      // console.log(response);
    } catch (error) {
      setCheckLogin(true);
      setLoading(false);
      setCheckLogin(error.response.data.error);
    }
  };
  const handleCheckboxChange = (event) => {
    const checkbox = event.target;
    if (checkbox.checked) {
      setChecked(true);
      console.log(checkbox.checked);
    } else {
      setChecked(false);
      console.log(checkbox.checked);
    }
  };
  return (
    <>
      <form style={style} className="mt-4">
        <h3 className="Heading">Login</h3>
        {checkLogin ? <p className="text-danger">{checkLogin}</p> : ""}

        <div className="mb-3">
          <label className="form-label">Username</label>
          <input
            name="username"
            value={username}
            onChange={(e) => {
              setUserName(e.target.value);
              setCheckU(false);
            }}
            type="text"
            className={checkU ? "form-control is-invalid" : "form-control"}
          />
          <div
            id="validationServerUsernameFeedback"
            className="invalid-feedback"
          >
            Không bỏ trống thông tin
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            name="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value), setCheckP(false);
            }}
            type="password"
            className={checkP ? "form-control is-invalid" : "form-control"}
          />
          <div
            id="validationServerUsernameFeedback"
            className="invalid-feedback"
          >
            Không bỏ trống Thông tin
          </div>
        </div>
        <div className="mb-3 form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="exampleCheck1"
            onChange={(e) => handleCheckboxChange(e)}
            checked={checked}
          />
          <label className="form-check-label">Check me out</label>
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
          Login
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
