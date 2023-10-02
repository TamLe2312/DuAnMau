import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";


function ForgotPassword() {
  const style = {
    margin: "0 auto",
    width: 600,
  };

  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [checkU, setCheckU] = useState(false);
  const [checkE, setCheckE] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkSendError, setCheckSendError] = useState("");
  const [checkSendSuccess, setCheckSendSuccess] = useState("");
  const handleClick = async (e) => {
    e.preventDefault();
    if (checkSendError) {
      setCheckSendError("");
    }
    if (checkSendSuccess) {
      setCheckSendSuccess("");
    }
    if (!username) {
      setCheckU(true);
      return;
    }
    if (!email) {
      setCheckE(true);
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post("http://localhost:8080/account/forgotPassword", {
        username,
        email,
      });
      setCheckSendSuccess(response.data.success);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.data && error.response.data.error) {
        setCheckSendError(error.response.data.error);
      } else {
        setCheckSendError('Something went wrong. Please try again.');
      }
    }
  };
  return (
    <>
      <form style={style} className="mt-4">
        <h3>Forgot Password</h3>
        {checkSendError ? <p className="text-danger">{checkSendError}</p> : ""}
        {checkSendSuccess ? <p className="text-success">{checkSendSuccess}</p> : ""}

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
          <label className="form-label">Email</label>
          <input
            name="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value), setCheckE(false);
            }}
            type="text"
            className={checkE ? "form-control is-invalid" : "form-control"}
          />
          <div
            id="validationServerUsernameFeedback"
            className="invalid-feedback"
          >
            Không bỏ trống Thông tin
          </div>
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
