const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ConversationSchema = new Schema({
    f_id: {
        type: Schema.Types.ObjectId,
        require: true,
    },
    s_id: {
        type: Schema.Types.ObjectId,
        require: true,
    },
    f_username: {
        type: String,
        require: true,
    },
    s_username: {
        type: String,
        require: true,
    },
    messages: [
        {
            content: {
                type: Schema.Types.Mixed,
                default:{}
            },
            of_user: Schema.Types.ObjectId,
            time: {
                type: Date,
                default: Date.now,
            },
        },
    ],
    l_update: {
        type: Date,
        default: Date.now,
    },
    l_message: {
        type: Schema.Types.Mixed,
        default: {},
    },
    l_sender: {
        type: String,
        default: "",
    },
});

const Conversation = mongoose.model("Conversation", ConversationSchema);
module.exports = Conversation;
