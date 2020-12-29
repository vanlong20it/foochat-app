const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        unique: true,
        require: true,
    },
    password: {
        type: String,
        required: true,
    },
    date_added: {
        type: Date,
        default: Date.now,
    },
    rule: {
        type: String,
        default: "user",
    },
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
