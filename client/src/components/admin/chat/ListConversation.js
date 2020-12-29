import React, { useEffect, useState, useContext } from "react";
import { history } from "../../context/history";
import { GlobalContext } from "../../reducer/ChatState";
import { NavLink } from "react-router-dom";
import socket from "../../context/socket";
const ListConversation = (props) => {
    const { conversations, isReady } = useContext(GlobalContext);
    const [keyword, setKeyword] = useState("");
    const [username, setUsername] = useState("");
    const [listConversation, setListConversation] = useState([]);

    useEffect(() => {
        if (isReady) {
            setListConversation(conversations);
        }
    }, [conversations, isReady]);

    useEffect(() => {
        if (conversations && isReady) {
            conversations.forEach((item) => {
                socket.emit("user-join-room", { roomId: item._id });
            });
            if (!props.chatId && conversations.length > 0) {
                history.replace(`/admin/chat/${conversations[0]._id}`);
            }
        }
        setUsername(localStorage.username);
    }, [isReady, setUsername, conversations, props.chatId]);

    return (
        <>
            <div className="list-conversation">
                <div className="conversation-title height-1">
                    <h2 className="display-5 text-center">Danh sách chat</h2>
                </div>
                <div className="px-2">
                    <div className="search-conversation">
                        <input
                            className="form-control"
                            onChange={(e) => {
                                setKeyword(e.target.value);
                                if (e.target.value === "") {
                                    setListConversation(conversations);
                                } else {
                                    const list = conversations.filter((item) =>
                                        item.s_username.includes(keyword)
                                    );
                                    setListConversation(list);
                                }
                            }}
                            onFocus={(e) => {
                                if (e.target.value === "") {
                                    setListConversation(conversations);
                                } else {
                                    const list = conversations.filter((item) =>
                                        item.s_username.includes(keyword)
                                    );
                                    setListConversation(list);
                                }
                            }}
                            type="search"
                            value={keyword}
                            name="search"
                            id="search"
                            placeholder="Tìm kiếm"
                        />
                    </div>
                    <div className="list-item">
                        {listConversation &&
                            listConversation.map((item, index) => (
                                <div className="item" key={index}>
                                    <NavLink
                                        className="nav-link"
                                        to={`/admin/chat/${item._id}`}
                                        activeClassName="active"
                                    >
                                        <div className="around">
                                            <div className="username">
                                                {username === item.f_username
                                                    ? item.s_username
                                                    : item.f_username}
                                            </div>
                                            <div className="last-message">
                                                <span className="name">
                                                    {item.l_sender}
                                                </span>
                                                :{" "}
                                                {item.l_message}
                                            </div>
                                        </div>
                                    </NavLink>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ListConversation;
