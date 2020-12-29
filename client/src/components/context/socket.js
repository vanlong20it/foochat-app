import io from "socket.io-client";
import url from "./url";

const socket = io(url.LOCAL);

socket.on("disconnect", () => {
    if (localStorage.userid) {
        socket.emit("user-set-offline", localStorage.userId);
    }
});
export default socket;
