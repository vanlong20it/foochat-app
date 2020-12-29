import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import url from "../context/url";
import request from "request";
import { history } from "../context/history";
const Login = () => {
    useEffect(() => {
        document.title = "Đăng ký";
    }, []);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [cfm_password, setCfmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [local, setLocal] = useState("");
    useEffect(() => {
        setLocal(url.LOCAL);
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();
        if (username === "" || password === "" || cfm_password === "") {
            setMessage("*Vui lòng điền đầy đủ thông tin");
            return;
        } else if (password !== cfm_password) {
            setMessage("*Password không trùng nhau");
            return;
        }
        const info = {
            username: username,
            password: password,
            cfm_password: cfm_password,
        };
        const options = {
            uri: local + "/api/register",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                ...info,
            }),
        };
        request.post(options, (err, httpResponse, body) => {
            if (httpResponse.statusCode !== 200) {
                setMessage(JSON.parse(body).message);
                return;
            } else {
                history.push("/");
            }
        });
    }

    return (
        <>
            <div className="register">
                <div className="title-page">
                    <h1 className="text-center">Đăng ký tài khoản</h1>
                </div>
                <div className="form-page">
                    <form method="post" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="username">Tên đăng nhập*</label>
                            <input
                                spellCheck="false"
                                autoComplete="off"
                                className="form-control"
                                name="username"
                                id="username"
                                type="text"
                                value={username}
                                placeholder="Tên đăng nhập"
                                onChange={(e) => {
                                    setUsername(e.target.value);
                                }}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Mật khẩu*</label>
                            <input
                                spellCheck="false"
                                autoComplete="off"
                                className="form-control"
                                name="password"
                                id="password"
                                type="password"
                                value={password}
                                placeholder="Mật khẩu"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="cfm_password">
                                Xác nhận mật khẩu*
                            </label>
                            <input
                                spellCheck="false"
                                autoComplete="off"
                                className="form-control"
                                name="cfm_password"
                                id="cfm_password"
                                type="password"
                                value={cfm_password}
                                placeholder="Nhập lại mật khẩu"
                                onChange={(e) => setCfmPassword(e.target.value)}
                            />
                        </div>
                        <div className="message">
                            <p>
                                <strong>{message}</strong>
                            </p>
                        </div>
                        <button
                            className="btn btn-primary"
                            onClick={handleSubmit}
                        >
                            Đăng ký
                        </button>
                        <div className="direct-page">
                            <div className="page-item">
                                <NavLink to="/">Login</NavLink>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Login;
