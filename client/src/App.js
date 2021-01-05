import React, { useContext } from "react";
import { Router, Route, Switch } from "react-router-dom";
import { history } from "./components/context/history";
import LoginUser from "./components/user/Login";
import RegisterUser from "./components/user/Register";
import LoginAdmin from "./components/admin/Login";
import UserChat from "./components/user/chat/Chat";
import AdminChat from "./components/admin/chat/Chat";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/scss/styles.scss";

const App = () => {
    return (
        <div
            className="context"
            onClick={() => {
                console.log("click");
            }}
        >
            <Router history={history}>
                <Switch>
                    <Route exact path="/" component={LoginUser} />
                    <Route exact path="/register" component={RegisterUser} />
                    <Route exact path="/admin" component={LoginAdmin} />
                    <Route exact path="/chat/" component={UserChat} />
                    <Route exact path="/chat/:id" component={UserChat} />
                    <Route exact path="/admin/chat/:id" component={AdminChat} />
                    <Route exact path="/admin/chat/" component={AdminChat} />
                </Switch>
            </Router>
        </div>
    );
};

export default App;
