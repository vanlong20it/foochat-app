import React, { useEffect, useState } from "react";
import { NavLink, Redirect } from "react-router-dom";
import url from "../context/url";
import request from "request";
import { history } from "../context/history";
const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [local, setLocal] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        document.title = "Đăng nhập quản trị";
    });

    useEffect(() => {
        setLocal(url.LOCAL);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const info = {
            username: username,
            password: password,
        };
        const options = {
            uri: local + `/api/admin/login`,
            method: "POST",
            headers: {
                "content-Type": "application/json",
            },
            body: JSON.stringify({
                ...info,
            }),
        };
        request.post(options, (err, httpResponse, body) => {
            const result = JSON.parse(body);
            if (httpResponse.statusCode !== 200) {
                setMessage(result.message);
                return;
            } else {
                localStorage.setItem('isadmin', true)
                localStorage.setItem("token", result.token);
                localStorage.setItem("userid", result.user.id);
                localStorage.setItem("username", result.user.username);
                history.push("/admin/chat");
            }
        });
    };
    return localStorage.getItem("token") ? (
        <Redirect to="/admin/chat" push={true} />
    ) : (
        <div className="login">
            <div className="title-page">
                <h1 className="text-center">Đăng nhập quản trị</h1>
            </div>
            <div className="form-page">
                <form method="post" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Tài khoản</label>
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
                        <label htmlFor="password">Mật khẩu</label>
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
                    <div className="message">
                        <p>
                            <strong>{message}</strong>
                        </p>
                    </div>
                    <button className="btn btn-primary" onClick={handleSubmit}>
                        Login
                    </button>
                    <div className="direct-page">
                        <div className="page-item">
                            <NavLink to="/register">Register</NavLink>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
