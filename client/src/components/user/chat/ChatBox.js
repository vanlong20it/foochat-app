import React, { useState, useEffect, useContext } from "react";
import { history } from "../../context/history";
import { GlobalContext } from "../../reducer/ChatState";
import socket from "../../context/socket";
import request from "request";
import url from "../../context/url";
import { animateScroll } from "react-scroll";
import send from "../../../assets/images/send.png";
import EmojiPicker from "emoji-picker-react";

const ChatBox = ({ chatId, userId }) => {
    const {
        conversations,
        getConversation,
        updateConversation,
        addConversation,
        addNewMessage,
        newMessage,
        isReady,
    } = useContext(GlobalContext);
    const [otherUsername, setOtherUsername] = useState("");
    const [cvs, setCvs] = useState([]);
    const [username, setUsername] = useState("");
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState("");
    const [otherTyping, setOtherTyping] = useState(false);
    const [openEmoji, setOpenEmoji] = useState("none");

    const onEmojiClick = (event, emojiObject) => {
        setInputMessage((inputMessage) => [...inputMessage, emojiObject.emoji]);
    };

    useEffect(() => {
        if (conversations) {
            conversations.forEach((item) => {
                socket.emit("user-join-room", { roomId: item._id });
            });
            if (!chatId && conversations.length > 0) {
                history.replace(`/chat/${conversations[0]._id}`);
            }
        }
        setUsername(localStorage.username);
    }, [setUsername, conversations, chatId]);

    useEffect(() => {
        if (isReady) {
            setCvs(getConversation(chatId));
            setUsername(localStorage.username);
            setOtherUsername(
                (userId === cvs.f_id ? cvs.s_username : cvs.f_username) || ""
            );
        }
    }, [
        chatId,
        getConversation,
        isReady,
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

                request.post(options, function (err, httpResponse, body) {
                    if (httpResponse.statusCode === 200) {
                        const { messageList } = JSON.parse(body);
                        setMessages(messageList);
                    }
                });

                socket.on("user-typing", ({ cid, uid, isTyping, name }) => {
                    console.log("user-typing: ",isTyping);
                    if (cid === cvs._id && uid !== userId) {
                        setOtherUsername(name);
                        if (isTyping !== otherTyping) {
                            setOtherTyping(isTyping);
                        } else {
                            setOtherTyping(false);
                        }
                    }
                });
            }
        }
    }, [setMessages, cvs._id, isReady, otherTyping, userId]);

    //Update messages list
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

    //Logout
    const handleLogout = () => {
        let confirm = window.confirm("Bạn có muốn đăng xuất!");
        if (confirm === true) {
            localStorage.removeItem("token");
            localStorage.removeItem("userid");
            localStorage.removeItem("username");
            history.replace("/");
        }
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
                <div>
                    <p>Từ: {username}</p>
                    <p>Đến: {otherUsername}</p>
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
                                <p>{item.content}</p>
                            </div>
                        ) : (
                            <div key={index} className="detail active-user">
                                <p>{item.content}</p>
                            </div>
                        )
                    )}
                </div>
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
                            socket.emit("user-typing-message", {
                                cid: chatId,
                                uid: userId,
                                isTyping: true,
                                name: username,
                            });
                        }}
                        value={inputMessage}
                    />
                </div>
                {otherTyping ? (
                    <div className="typing">
                        {otherUsername} đang trả lời...
                    </div>
                ) : null}
                <div className="send-message">
                    <button
                        className="chat-btn"
                        onClick={() => {
                            sendMessage();
                            openEmoji === "block"
                                ? setOpenEmoji("none")
                                : setOpenEmoji("block");
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
    );
};

export default ChatBox;
