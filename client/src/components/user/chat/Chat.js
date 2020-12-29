import React, { useEffect, useState } from "react";
import { GlobalProvider } from "../../reducer/ChatState";
import ChatBox from "./ChatBox";
import avatar from "../../../assets/images/icon.png";
import {history} from '../../context/history'

const Chat = (props) => {
    const [userId, setUserId] = useState("");
    const [chatId, setChatId] = useState("");

    useEffect(() => {
        document.title = "Chat App";
    }, []);

    useEffect(() => {
        setUserId(localStorage.userid);
        setChatId(props.match.params.id);
    }, [props.match.params.id]);
    return localStorage.getItem('isadmin')==='true'?(history.push('/admin')):(
        <GlobalProvider>
            <div className="chat-app">
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
