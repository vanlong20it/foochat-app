import React, { useEffect, useState, useContext } from "react";
import { GlobalProvider } from "../../reducer/ChatState";
import ListConversation from "./ListConversation";
import ChatBox from "./ChatBox";
import avatar from "../../../assets/images/icon.png";
import { history } from "../../context/history";
import socket from "../../context/socket";
const Chat = (props) => {
    const [userId, setUserId] = useState("");
    const [chatId, setChatId] = useState("");
    const [activeChat, setActiveChat] = useState(false);
    const timer = 5000;

    useEffect(() => {
        document.title = "Admin";
    }, []);

    useEffect(() => {
        setUserId(localStorage.userid);
        setChatId(props.match.params.id);
        setActiveChat(true);
    }, [props.match.params.id]);

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

    return localStorage.getItem("isadmin") === "true" ? (
        <GlobalProvider>
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
                    activeChat === false
                        ? "chat-admin"
                        : "chat-admin active-form"
                }
            >
                <div className="title-name">
                    <img src={avatar} alt="chatapp" />
                    <h1 className="display-title">Chat App</h1>
                </div>
                <div className="main-content">
                    <ListConversation chatId={chatId} />
                    <ChatBox chatId={chatId} userId={userId} />
                </div>
            </div>
        </GlobalProvider>
    ) : (
        <div>
            {localStorage.removeItem("token")}
            {history.push("/")}
        </div>
    );
};

export default Chat;
