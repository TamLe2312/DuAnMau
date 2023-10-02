import axios from "axios";
import React, { useEffect, useState } from 'react';
import Validation from "../../component/validation/validation";
import { useLocation, Link, useNavigate } from 'react-router-dom';


function VerifyToken() {
    const Navigate = useNavigate();
    const style = {
        margin: '0 auto',
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

    const [email, setEmail] = useState('');

    const location = useLocation();
    //Lấy tham số URL
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const emailParam = searchParams.get('email');

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
            const response = await axios.post("http://localhost:8080/account/verifyToken", {
                username: values.username.trim(),
                password: values.password,
                Cpassword: values.Cpassword,
                email: email,
            });
            setCheckSuccess(response.data.success);
            Navigate("/", { replace: true });
            setLoading(false);
        } catch (error) {
            setLoading(false);
            if (error.response && error.response.data && error.response.data.error) {
                setCheckError(error.response.data.error);
            } else {
                setCheckError('Something went wrong. Please try again.');
            }
        }
    };

    return (
        <>
            <form style={style} className="mt-4">
                <h3>Verify Account</h3>
                {checkError && Object.keys(error).length === 0 ? (
                    <p className="text-danger">{checkError}</p>
                ) : (
                    ""
                )}
                {checkSuccess && Object.keys(error).length === 0 ? (
                    <p className="text-success">{checkSuccess}</p>
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
                        className={error.username ? 'form-control is-invalid' : 'form-control'}
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
                    <label className="form-label">Password</label>
                    <input
                        name="password"
                        value={values.password}
                        onChange={(e) => {
                            handleChange(e);
                        }}
                        type="password"
                        className={error.password ? 'form-control is-invalid' : 'form-control'}
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
                    <label className="form-label">Confirm Password</label>
                    <input
                        name="Cpassword"
                        value={values.Cpassword}
                        onChange={(e) => {
                            handleChange(e);
                        }}
                        type="password"
                        className={error.Cpassword ? 'form-control is-invalid' : 'form-control'
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