import io from "socket.io-client";
import url from "./url";

const socket = io(url.LOCAL, {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: Infinity,
});

socket.on("user-disconnect", () => {
    if (localStorage.userid) {
        socket.emit("user-set-offline", localStorage.userid);
    }
});

export default socket;
