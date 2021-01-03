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
    const [message, setMessage] = useState([]);
    const [local, setLocal] = useState("");
    useEffect(() => {
        setLocal(url.LOCAL);
    }, []);

    const validate = () => {};

    async function handleSubmit(e) {
        e.preventDefault();
        setMessage([]);
        let flag = true;
        if (username === "" || password === "" || cfm_password === "") {
            setMessage((message) => [
                ...message,
                "*Vui lòng điền đầy đủ thông tin",
            ]);
            flag = false;
        }
        if (password !== cfm_password) {
            setMessage((message) => [...message, "*Password không trùng nhau"]);
            flag = false;
        }
        if (username.length < 5 || password.length < 5) {
            setMessage((message) => [
                ...message,
                "*username, password phải nhiều hơn 5 ký tự!",
            ]);
            flag = false;
        }
        if (username.includes(" ") || password.includes(" ")) {
            setMessage((message) => [
                ...message,
                "*username, password không được chứa khoảng trắng!",
            ]);
            flag = false;
        }
        if (!flag) {
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
                const result = JSON.parse(body).message;
                setMessage((message) => [...message, result]);
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
                        <div className="message text-danger text-left">
                            {message.length >= 1 &&
                                message.map((item, index) => (
                                    <p key={index}>
                                        <strong>{item}</strong>
                                    </p>
                                ))}
                        </div>
                        <button
                            className="btn btn-primary"
                            onClick={handleSubmit}
                        >
                            Đăng ký
                        </button>
                        <div className="direct-page">
                            <div className="page-item">
                                <NavLink to="/" className="btn btn-info">
                                    Login
                                </NavLink>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Login;
