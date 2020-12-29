import React, { useEffect, useState } from "react";
import { GlobalProvider } from "../../reducer/ChatState";
import ListConversation from "./ListConversation";
import ChatBox from "./ChatBox";
import avatar from "../../../assets/images/icon.png";
import {history} from "../../context/history";
const Chat = (props) => {
    const [userId, setUserId] = useState("");
    const [chatId, setChatId] = useState("");

    useEffect(() => {
        document.title = "Admin";
    }, []);
    useEffect(() => {
        setUserId(localStorage.userid);
        setChatId(props.match.params.id);
    }, [props.match.params.id]);
    return localStorage.getItem("isadmin") === 'true' ? (
        <GlobalProvider>
            <div className="chat-admin">
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
