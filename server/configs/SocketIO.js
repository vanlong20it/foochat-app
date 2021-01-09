const User = require("../models/User");
module.exports = (io) => {
    io.on("connection", (socket) => {
        //Test server and client
        socket.on("test", (data) => {
            console.log(data);
        });

        socket.on("disconnect", () => {
            socket.emit("user-disconnect");
            socket.disconnect();
        });

        socket.on("user-login", (uid) => {
            User.findById(uid).exec((err, user) => {
                if (user) {
                    user.is_online = true;
                    user.save();
                }
            });
        });

        socket.on("user-set-offline", (uid) => {
            User.findById(uid).exec((err, user) => {
                if (user) {
                    user.is_online = false;
                    user.save();
                }
            });
        });

        socket.on("user-send-message", ({ conversation, newMessage }) => {
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

        // seen
        socket.on("seen", ({ chatid, status }) => {
            console.log(status);
            socket.to(`chat-${chatid}`).emit("seen", { status: status });
        });
    });
};
