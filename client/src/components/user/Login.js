import React, { useEffect, useState } from "react";
import { NavLink, Redirect } from "react-router-dom";
import { history } from "../context/history";
import request from "request";
import url from "../context/url";

const Login = () => {
    const [local, setLocal] = useState("");
    const [message, setMessage] = useState("");
    useEffect(() => {
        document.title = "Đăng nhập";
    });

    useEffect(() => {
        setLocal(url.LOCAL);
    }, [setLocal]);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        const info = {
            username: username,
            password: password,
        };
        const options = {
            uri: local + "/api/login",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
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
                localStorage.setItem("token", result.token);
                localStorage.setItem("userid", result.user.id);
                localStorage.setItem("username", result.user.username);
                history.push("/");
            }
        });
    };
    if (
        localStorage.getItem("token") &&
        localStorage.getItem("isadmin") === 'true'
    ) {
        return <Redirect to="/admin/chat" push={true} />;
    }
    return localStorage.getItem("token") ? (
        <Redirect exact to="/chat" push={true} />
    ) : (
        <div className="login">
            <div className="title-page">
                <h1 className="text-center">Đăng nhập</h1>
            </div>
            <div className="form-page">
                <form method="post" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Tên đăng nhập</label>
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
                        <label htmlFor="username">Mật khẩu</label>
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
                        Đăng nhập
                    </button>
                    <div className="direct-page">
                        <div className="page-item">
                            <NavLink to="/register" className="btn btn-info">Đăng ký</NavLink>
                        </div>
                        <div className="page-item admin">
                            <NavLink to="/admin" className="btn btn-info">Đăng nhập admin</NavLink>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
