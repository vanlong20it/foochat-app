import React, { useContext, useEffect, useState } from "react";
import { history } from "../../context/history";
import { GlobalContext } from "../../reducer/ChatState";
import url from "../../context/url";
import socket from "../../context/socket";
import request from "request";
import { animateScroll } from "react-scroll";
import send from "../../../assets/images/send.png";
import EmojiPicker from "emoji-picker-react";

const ChatBox = ({ chatId, userId }) => {
    const {
        getConversation,
        updateConversation,
        addConversation,
        addNewMessage,
        newMessage,
        isReady,
    } = useContext(GlobalContext);
    const [cvs, setCvs] = useState([]);
    const [otherUsername, setOtherUsername] = useState("");
    const [username, setUsername] = useState("");
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState("");
    const [openEmoji, setOpenEmoji] = useState("none");

    const onEmojiClick = (event, emojiObject) => {
        setInputMessage((inputMessage) => [...inputMessage, emojiObject.emoji]);
    };

    useEffect(() => {
        if (isReady) {
            setCvs(getConversation(chatId));
            setUsername(localStorage.username);
            setOtherUsername(
                (userId === cvs.f_id ? cvs.s_username : cvs.f_username) || ""
            );
        }
    }, [
        isReady,
        chatId,
        getConversation,
        setUsername,
        cvs.f_id,
        cvs.s_username,
        cvs.f_username,
        userId,
        setOtherUsername,
    ]);

    //Receive message
    useEffect(() => {
        if (isReady) {
            socket.on("receive-message", ({ conversation, newMessage }) => {
                const cvs = getConversation(conversation._id);
                if (cvs) {
                    if (localStorage.username === conversation.l_sender) {
                        return;
                    }
                    updateConversation(conversation);
                    addNewMessage({
                        conversation: conversation,
                        message: newMessage,
                    });
                } else {
                    addConversation(conversation);
                }
            });
        }
    }, [isReady]);

    //Get message
    useEffect(() => {
        if (isReady) {
            setMessages([]);
            if (cvs._id) {
                const options = {
                    uri: `${url.LOCAL}/api/get-messages?cid=${cvs._id}`,
                    method: "post",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.token}`,
                    },
                };

                request.post(options, (err, httpResponse, body) => {
                    if (httpResponse.statusCode === 200) {
                        const { messageList } = JSON.parse(body);
                        setMessages(messageList);
                    }
                });
            }
        }
    }, [setMessages, cvs._id, isReady]);

    //Update message list
    useEffect(() => {
        if (isReady) {
            if (cvs._id && newMessage) {
                if (cvs._id === newMessage.cid) {
                    setMessages((messages) => [
                        ...messages,
                        newMessage.message,
                    ]);
                }
            }
        }
    }, [isReady, newMessage, cvs._id]);

    //Logout
    const handleLogout = () => {
        let confirm = window.confirm("Bạn có muốn đăng xuất!");
        if (confirm === true) {
            localStorage.removeItem("token");
            localStorage.removeItem("userid");
            localStorage.removeItem("username");
            localStorage.removeItem("isadmin");
            history.replace("/");
        }
    };

    //Send message
    const sendMessage = () => {
        const content = inputMessage;
        setInputMessage("");
        if (!content || content === "") {
            return;
        }
        const options = {
            uri: url.LOCAL + "/api/send-message",
            method: "post",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.token}`,
            },
            body: JSON.stringify({
                cid: chatId,
                uid: userId,
                content: content,
                username: username,
            }),
        };
        request.post(options, (err, httpResponse, body) => {
            if (httpResponse.statusCode === 200) {
                const objResult = JSON.parse(body);
                addNewMessage({
                    conversation: objResult.conversation,
                    message: objResult.newMessage,
                });
                updateConversation(objResult.conversation);
                socket.emit("user-send-message", {
                    conversation: objResult.conversation,
                    newMessage: objResult.newMessage,
                });
            }
        });
    };

    // Scroll to bottom
    useEffect(() => {
        animateScroll.scrollToBottom({
            containerId: "list",
            smooth: false,
            duration: 0,
        });
    }, [messages]);

    return (
        <div className="chat-box">
            <nav className="nav-chat height-1">
                <div className="current-chat">
                    <h2 className="display-5">{otherUsername}</h2>
                </div>
                <div>
                    <button onClick={handleLogout} className="btn btn-danger">
                        Đăng xuất
                    </button>
                </div>
            </nav>
            <div className="round-message">
                <div className="chat-list" id="list">
                    {messages.map((item, index) =>
                        item.of_user === userId ? (
                            <div key={index} className="detail user">
                                <div className="round-item">
                                    <span className="info">
                                        {new Date(item.time).toLocaleString()}
                                    </span>
                                    <p>{item.content}</p>
                                </div>
                            </div>
                        ) : (
                            <div key={index} className="detail active-user">
                                <div className="round-item">
                                    <span className="info">
                                        {new Date(item.time).toLocaleString()}
                                    </span>
                                    <p>{item.content}</p>
                                </div>
                            </div>
                        )
                    )}
                </div>
                <div className="input-box">
                    <div className="input-message">
                        <input
                            className="form-control chat-input"
                            onKeyPress={(event) => {
                                if (event.key === "Enter" || event.key === 13) {
                                    sendMessage();
                                }
                            }}
                            type="text"
                            onChange={(e) => {
                                setInputMessage(e.target.value);
                            }}
                            value={inputMessage}
                        />
                    </div>
                    <div className="send-message">
                        <button
                            className="chat-btn"
                            onClick={() => {
                                sendMessage();
                                openEmoji === "block"
                                    ? setOpenEmoji("none")
                                    : "";
                            }}
                        >
                            {<img src={send} alt="Send" />}
                        </button>
                    </div>
                    <div
                        className="sticker"
                        onClick={() => {
                            openEmoji === "none"
                                ? setOpenEmoji("block")
                                : setOpenEmoji("none");
                        }}
                    ></div>
                    <div className="emoji-chat" style={{ display: openEmoji }}>
                        <EmojiPicker onEmojiClick={onEmojiClick} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatBox;
