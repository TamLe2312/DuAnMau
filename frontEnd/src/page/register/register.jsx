import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import Validation from "../../component/validation/validation";
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
      const res = await axios.post("http://localhost:8080/account/register", {
        username: values.username.trim(),
        password: values.password,
        email: values.email,
      });
      console.log(res);
      setLoading(false);
      navigate("/home", { replace: true });
    } catch (error) {
      console.error(error);

      setLoading(false);
      console.error(error);
      toast.error(error.response.data.error);
      // setCheckLogin(error.response.data.error);
    }
  };

  return (
    <>
      <form style={style} className="mt-4">
        <h3>Đăng ký</h3>
        {checkLogin && Object.keys(error).length === 0 ? (
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
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
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
          Đăng ký
        </button>

        <div className="mt-2">
          <Link className="mt-4" to="/forgotPassword">
            Quên mật khẩu
          </Link>
        </div>
        <div>
          <Link className="mt-4" to="/">
            Login
          </Link>
        </div>
      </form>
    </>
  );
}

export default Register;