const User = require("./User");
const Conversation = require("./Conversation");
module.exports = (type) => {
    switch (type) {
        case "User":
            return User;
        case "Conversation": {
            return new Conversation;
        }
        default:
            break;
    }
    return;
};