import React, { useEffect, useState } from "react";
import { GlobalProvider } from "../../reducer/ChatState";
import ChatBox from "./ChatBox";
import avatar from "../../../assets/images/icon.png";
import { history } from "../../context/history";
import socket from "../../context/socket";

const Chat = (props) => {
    const [userId, setUserId] = useState("");
    const [chatId, setChatId] = useState("");
    const [activeChat, setActiveChat] = useState(false);
    const timer = 100000;

    useEffect(() => {
        document.title = "Chat App";
    }, []);

    useEffect(() => {
        if (activeChat) {
            socket.emit("user-login", localStorage.userid);
        } else {
            socket.emit("user-set-offline", localStorage.userid);
        }
    }, [activeChat, localStorage.userid]);

    useEffect(() => {
        if (activeChat === true) {
            const interval = setTimeout(() => {
                console.log("Da deactive");
                setActiveChat(false);
            }, timer);
            return () => clearTimeout(interval);
        }
    }, [activeChat, setActiveChat, setTimeout]);

    useEffect(() => {
        setUserId(localStorage.userid);
        setChatId(props.match.params.id);
        setActiveChat(true);
    }, [props.match.params.id]);
    return localStorage.getItem("isadmin") === "true" ? (
        history.push("/admin")
    ) : (
        <GlobalProvider>
            <div
                className="context"
                onClick={() => {
                    if (activeChat) {
                        setActiveChat(false);
                    }
                }}
            ></div>
            <div
                onClick={() => {
                    if (activeChat === false) {
                        setActiveChat(true);
                    }
                }}
                onChange={() => {
                    setActiveChat(true);
                }}
                className={
                    activeChat === false ? "chat-app" : "chat-app active-form"
                }
            >
                <div className="title-name">
                    <img src={avatar} alt="chatapp" />
                    <h1 className="display-title">Chat App</h1>
                </div>
                <div className="main-content">
                    <ChatBox chatId={chatId} userId={userId} />
                </div>
            </div>
        </GlobalProvider>
    );
};

export default Chat;
