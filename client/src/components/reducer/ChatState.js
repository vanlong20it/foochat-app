import React, { createContext, useReducer, useEffect } from "react";
import AppReducer from "./AppReducer";
import request from "request";
import url from "../context/url";
import { history } from "../context/history";
const initialState = {
    conversations: [],
    ready: false,
    sessionValid: true,
    refresh: false,
    newMessage: { cid: "", message: {} },
    isEmojiShow: false,
    inputEvent: {},
};

export const GlobalContext = createContext(initialState);

export const GlobalProvider = ({ children }) => {
    const [state, dispatch] = useReducer(AppReducer, initialState);

    useEffect(() => {
        let isSubscribed = true;
        (async function fetchData() {
            const options = {
                uri: `${url.LOCAL}/api/admin/conversation-list?id=${localStorage.userid}`,
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.token}`,
                },
            };

            request.post(options, function (err, httpResponse, body) {
                if (err || httpResponse.statusCode !== 200) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("username");
                    localStorage.removeItem("userid");
                    history.replace("/");
                } else {
                    const obj = JSON.parse(body);
                    updateConversations(obj.list);
                }
            });
        })();
        // eslint-disable-next-line no-unused-vars
        return () => {isSubscribed = false};
    }, []);

    const updateConversations = (cs) => {
        dispatch({ type: "update", conversations: cs });
    };

    const updateConversation = (cs) => {
        dispatch({ type: "update-single", conversation: cs });
    };

    const addConversation = (cs) => {
        dispatch({ type: "add", conversation: cs });
    };

    const updateRefresh = () => {
        dispatch({ type: "refresh" });
    };

    const getConversation = (cid) => {
        return state.conversations.find((c) => c._id === cid) || 0;
    };

    const addNewMessage = ({ conversation, message }) => {
        dispatch({ type: "new-message", conversation, message });
    };

    const updateInputEvent = (inputEvent) => {
        dispatch({ type: "update-input", inputEvent });
    };

    return (
        <GlobalContext.Provider
            value={{
                conversations: state.conversations,
                newMessage: state.newMessage,
                isEmojiShow: state.isEmojiShow,
                isReady: state.ready,
                refresh: state.refresh,
                inputEvent: state.inputEvent,
                updateRefresh: updateRefresh,
                updateConversations: updateConversations,
                updateConversation: updateConversation,
                getConversation: getConversation,
                addConversation: addConversation,
                addNewMessage: addNewMessage,
                updateInputEvent: updateInputEvent,
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};
