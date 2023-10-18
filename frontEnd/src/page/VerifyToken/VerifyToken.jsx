import axios from "axios";
import React, { useEffect, useState } from "react";
import Validation from "../../component/validation/validation";
import { toast } from "sonner";
import { useLocation, Link, useNavigate } from "react-router-dom";
import Logo from "../../../uploads/Logo1.png";

function VerifyToken() {
  const Navigate = useNavigate();
  const style = {
    margin: "0 auto",
    width: 600,
  };
  const [values, setValues] = useState({
    username: "",
    password: "",
    Cpassword: "",
  });

  const [error, setError] = useState({});
  const [checkError, setCheckError] = useState("");
  const [checkSuccess, setCheckSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");

  const location = useLocation();
  //Lấy tham số URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const emailParam = searchParams.get("email");

    setEmail(emailParam);
  }, [location]);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
    setError({ ...error, [e.target.name]: "" });
    setCheckError("");
  };

  const handleClick = async (e) => {
    e.preventDefault();
    if (checkError) {
      setCheckError("");
    }
    if (checkSuccess) {
      setCheckSuccess("");
    }
    setError(Validation(values));
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:8080/account/verifyToken",
        {
          username: values.username.trim(),
          password: values.password,
          Cpassword: values.Cpassword,
          email: email,
        }
      );
      console.log(response);
      toast.success(response.data.success);
      Navigate("/", { replace: true });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
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
                  placeholder="Xác nhận mật khẩu"
                  name="Cpassword"
                  value={values.Cpassword}
                  onChange={(e) => {
                    handleChange(e);
                  }}
                  type="password"
                  className={
                    error.Cpassword ? "form-control is-invalid" : "form-control"
                  }
                />
                {error.Cpassword && (
                  <div
                    id="validationServerUsernameFeedback"
                    className="invalid-feedback"
                  >
                    {error.Cpassword}
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
                  <span>Submit</span>
                )}
              </button>
              <div className="mt-2 highlightLinkButton">
                <span>Có tài khoản?</span>
                <Link className="mt-4" to="/">
                  Login
                </Link>
              </div>
              <div className="highlightLinkButton">
                <Link className="mt-4" to="/register">
                  Đăng kí
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default VerifyToken;
