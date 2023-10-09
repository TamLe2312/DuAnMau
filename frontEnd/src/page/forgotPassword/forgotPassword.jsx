import axios from "axios";
import { useState } from "react";
import Validation from "../../component/validation/validation";
import { Link, useNavigate } from "react-router-dom";


function ForgotPassword() {
  const style = {
    margin: "0 auto",
    width: 600,
  };

  const [values, setValues] = useState({
    username: "",
    email: "",
  });
  const [checkLogin, setCheckLogin] = useState("");
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
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
      const response = await axios.post("http://localhost:8080/account/forgotPassword", {
        username: values.username.trim(),
        email: values.email,
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };
  return (
    <>
      <form style={style} className="mt-4">
        <h3>Forgot Password</h3>
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
          {loading ? (
            <>
              <div className="spinner-border spinner-border-sm mr-2" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <span> Loading</span>
            </>
          ) : (
            <span>Submit</span>
          )}
        </button>
        <div className="mt-2">
          <Link className="mt-4" to="/">
            Login
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

export default ForgotPassword;
