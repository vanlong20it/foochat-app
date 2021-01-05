const User = require("../models/User");
module.exports = (io) => {
    io.on("connection", (socket) => {
        //Test server and client
        socket.on("test", (data) => {
            console.log(data);
        });

        socket.on("disconnect", () => {
            console.log("Nguoi dung offline: ", socket.io);
            socket.emit("user-disconnect");
            socket.disconnect();
        });

        socket.on("user-login", (uid) => {
            console.log("Người dùng online: ", uid);
            User.findById(uid).exec((err, user) => {
                if (user) {
                    console.log(user);
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
            socket.to(`chat-${conversation._id}`).emit("receive-message", {
                conversation: conversation,
                newMessage: newMessage,
            });
        });

        socket.on("user-join-room", ({ roomId }) => {
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
