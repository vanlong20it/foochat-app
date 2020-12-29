const User = require("../models/User");
module.exports = (io) => {
    io.on("connection", (socket) => {
        console.log("User has connected: ", socket.id);

        //Test server and client
        socket.on("test", (data) => {
            console.log(data);
        });

        socket.on("disconnect", () => {
            socket.emit("user-disconnect");
            socket.disconnect();
        });

        socket.on("user-login", (uid) => {
            console.log("Người dùng đăng nhập: ", uid);
            User.findById(uid).exec((err, user) => {
                if (user) {
                    user.is_online = true;
                    user.save();
                }
            });
        });

        socket.on("user-set-offline", (uid) => {
            console.log("Người dùng offline: ", uid);
            User.findById(uid).exec((err, user) => {
                if (user) {
                    user.is_online = false;
                    user.save();
                }
            });
        });

        socket.on("user-send-message", ({ conversation, newMessage }) => {
            console.log("User send message to server");
            socket.to(`chat-${conversation._id}`).emit(
                "receive-message",
                {
                    conversation: conversation,
                    newMessage: newMessage,
                }
            );
        });

        socket.on("user-typing-message", ({ cid, uid, isTyping, name }) => {
            socket
                .to(`chat-${cid}`)
                .emit("user-typing", { cid, uid, isTyping, name });
        });

        socket.on("user-join-room", ({ roomId }) => {
            console.log(`A user joined chat-${roomId}`);
            socket.join(`chat-${roomId}`);
        });

        socket.on("new-conversation", ({ conversation, createId }) => {
            const otherId =
                conversation.f_id === createId
                    ? conversation.s_id
                    : conversation.f_id;
            socket.broadcast.emit("add-new-conversation", {
                conversation: conversation,
                receiveId: otherId,
            });
        });
    });
};
