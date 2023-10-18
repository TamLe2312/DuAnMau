import axios from "axios";
import { useState } from "react";
import Validation from "../../component/validation/validation";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Logo from "../../../uploads/Logo1.png";

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
      const response = await axios.post(
        "http://localhost:8080/account/forgotPassword",
        {
          username: values.username.trim(),
          email: values.email,
        }
      );
      toast.success(response.data.success);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(error.response.data.error);
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
                {loading ? (
                  <>
                    <div
                      className="spinner-border spinner-border-sm mr-2"
                      role="status"
                    >
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <span> Loading</span>
                  </>
                ) : (
                  <span>Quên mật khẩu</span>
                )}
              </button>
              <div className="mt-2 highlightLinkButton">
                <span>Có tài khoản?</span>
                <Link className="mt-4" to="/">
                  Đăng nhập
                </Link>
              </div>
              <div className="highlightLinkButton">
                <Link className="mt-4" to="/register">
                  Đăng kí ngay
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default ForgotPassword;
