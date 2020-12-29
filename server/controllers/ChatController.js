const User = require("../models/User");
const Conversation = require("../models/Conversation");

exports.findPeople = async (req, res) => {
    const { s } = req.query;
    if (s === undefined) s = "";
    const result = await User.find({ username: new RegExp(s, "i") })
        .select("-password")
        .lean()
        .catch((err) =>
            res
                .status(500)
                .json({ message: "Lỗi máy chủ khi tìm kiếm người dùng!" })
        );
    return res.status(200).json({ result: result });
};

exports.getConversation = async (req, res) => {
    let { id1, id2 } = req.query;
    if (!id1 || !id2)
        res.status(404).json({ message: "Không tìm thấy userId" });
    if (id1 > id2) {
        id2 = [id1, (id1 = id2)][0];
    }
    const cvs = await Conversation.findOne({
        f_id: id1,
        s_id: id2,
    }).lean();
    if (cvs) return res.status(200).json({ conversation: cvs });
    const firstUser = await User.findById(id1).lean();
    const secondUser = await User.findById(id2).lean();
    const newConversation = Conversation({
        f_id: id1,
        s_id: id2,
        f_username: firstUser.username,
        s_username: secondUser.username,
    });
    newConversation.save((err, conversation) => {
        if (err) {
            console.log("Have errors!");
            console.log(err);
            return res.status(500).json({
                message: "Lỗi máy chủ khi tạo cuộc trò chuyện!",
            });
        }
        return res.status(200).json({ conversation: conversation.toObject() });
    });
};

exports.getConversationList = async (req, res) => {
    const { id } = req.query;
    if (!id)
        return res.status(404).json({ message: "Không tìm thấy người dùng!" });
    const listConversation = await Conversation.find({
        $or: [{ f_id: id }, { s_id: id }],
        $and: [{ l_message: { $ne: "" } }],
    })
        .select("-messages")
        .sort({ l_update: -1 })
        .lean();
    if (listConversation)
        return res.status(200).json({ list: listConversation });
    return res.status(200).json({ list: [] });
};

exports.getMessages = async (req, res) => {
    const { cid, page, last } = req.query;
    if (!cid)
        return res.status(400).json({ message: "Quên cid cuộc trò chuyện" });
    const conversation = await Conversation.findById(cid).lean();
    if (!conversation)
        res.status(404).json({ message: "Không tìm thấy cuộc trò chuyện!" });
    const { f_username, s_username, f_id, s_id } = conversation;
    return res
        .status(200)
        .json({
            messageList: conversation.messages,
            message: {
                f_username: f_username,
                s_username: s_username,
                f_id: f_id,
                s_id: s_id,
            },
        });
};

exports.sendMessage = async (req, res) => {
    const { cid, content, uid, username } = req.body;
    if (!cid || !content || !uid)
        return res
            .status(400)
            .json({ message: "Quên dữ liệu - (cid, content, uid)!" });
    const conversation = await Conversation.findById(cid);
    if (!conversation)
        res.status(404).json({ message: "Không tìm thấy cuộc trò chuyện!" });
    const currentTime = Date.now();

    conversation.messages.push({
        of_user: uid,
        content: content,
        time: currentTime,
    });
    conversation.l_message = content;
    conversation.l_sender = username;
    conversation.l_update = currentTime;
    conversation.save((err, cv) => {
        if (err) {
            console.log(err);
            return res
                .status(500)
                .json({ message: "Lỗi máy chủ khi thêm tin nhắn mới!" });
        }
        const newMessage = cv.messages[conversation.messages.length - 1];
        conversation.messages = undefined;
        return res.status(200).json(
            (body = {
                message: "Thêm tin nhắn mới thành công!",
                newMessage: newMessage,
                conversation: conversation.toObject(),
            })
        );
    });
};

exports.getChat = async (req, res) => {
    const { id } = req.query;
    if (!id) {
        return res
            .status(202)
            .json({ message: "Có lỗi xảy ra, hãy đăng nhập lại!" });
    }
    const conversation = await Conversation.findOne({ s_id: id }).lean();
    if (!conversation) {
        res.status(202).json({
            message: "Không thể thiết lập cuộc trò chuyện của bạn!",
        });
    }
    return res.status(200).json({ conversation: conversation });
};
