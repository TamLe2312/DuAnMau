import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";


function VerifyToken() {
    const style = {
        margin: "0 auto",
        width: 600,
    };
    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [Cpassword, setCPassword] = useState("");
    const [checkU, setCheckU] = useState(false);
    const [checkP, setCheckP] = useState(false);
    const [checkCP, setCheckCP] = useState(false);
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
        if (!password) {
            setCheckP(true);
            return;
        }
        if (!Cpassword) {
            setCheckCP(true);
            return;
        }
        try {
            setLoading(true);
            const response = await axios.get("http://localhost:8080/account/verifyToken/", {
                username,
                password,
                Cpassword,
            });
            /* setCheckSendSuccess(response.data.success); */
            setCheckSendSuccess("OK");
            setLoading(false);
        } catch (error) {
            console.log(error);
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
                <h3>Verify Account</h3>
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
                <div className="mb-3">
                    <label className="form-label">Confirm Password</label>
                    <input
                        name="Cpassword"
                        value={Cpassword}
                        onChange={(e) => {
                            setCPassword(e.target.value), setCheckCP(false);
                        }}
                        type="password"
                        className={checkCP ? "form-control is-invalid" : "form-control"}
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

export default VerifyToken;
