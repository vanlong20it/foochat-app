const User = require("../models/User");
const Conversation = require("../models/Conversation");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const keys = "secret";
const USERNAME = "longnguyen";
const PASSWORD = "longnguyen";
const RULE = "admin";

let admin_1 = {};
exports.register = async (req, res) => {
    User.findOne({ rule: "admin" }).then((result) => {
        if (result) {
            admin_1 = result;
        } else {
            const newAdmin = User({
                username: USERNAME,
                password: PASSWORD,
                rule: RULE,
            });
            console.log("Username: ", newAdmin.username);
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newAdmin.password, salt, (err, hash) => {
                    if (err) {
                        return;
                    }
                    newAdmin.password = hash;
                    newAdmin
                        .save()
                        .then((result) => {
                            admin_1 = result;
                        })
                        .catch((err) => {
                            console.log("Can't create new account for admin");
                        });
                });
            });
        }
    });

    const { username, password } = req.body;
    if (username === USERNAME) {
        return res
            .status(202)
            .json({ message: "Tên người dùng đã tồn tại!" });
    }
    const user = await User.findOne({ username: username });
    if (user)
        return res.status(202).json({ message: "Tên người dùng đã tồn tại!" });
    const newUser = User({
        username: username,
        password: password,
    });

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) return res.status(500).json({ message: "Lỗi máy chủ!" });
            newUser.password = hash;
            newUser
                .save()
                .then((user) => {
                    if (admin_1) {
                        const id1 = admin_1._id;
                        const username1 = admin_1.username;
                        const id2 = user._id;
                        const username2 = user.username;
                        if (id1 > id2) {
                            id2 = [id1, (id1 = id2)][0];
                            username2 = [username1, (username1 = username2)][0];
                        }
                        const currentTime = Date.now();
                        const welcomeMessage =
                            "Xin chào " + user.username + "! Bạn cần giúp gì?";
                        const defaultConversation = Conversation({
                            f_id: id1,
                            s_id: id2,
                            f_username: username1,
                            s_username: username2,
                            messages: [
                                {
                                    content: welcomeMessage,
                                    of_user: admin_1._id,
                                    time: currentTime,
                                },
                            ],
                            l_update: currentTime,
                            l_sender: admin_1.username,
                            l_message: welcomeMessage,
                        });
                        defaultConversation.save();
                    }
                    res.status(200).json({ user: user });
                })
                .catch((err) =>
                    res.status(500).json({ message: "Lỗi máy chủ!" })
                );
        });
    });
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username: username, rule: "user" });

    if (!user)
        return res
            .status(202)
            .json({ message: "Sai tên tài khoản hoặc mật khẩu, hãy thử lại" });
    const passwordMatch = bcrypt.compareSync(password, user.password);

    if (!passwordMatch)
        return res
            .status(202)
            .json({ message: "Sai tên tài khoản hoặc mật khẩu, hãy thử lại" });

    const payload = { id: user._id, username: user.username };
    jwt.sign(payload, keys, { expiresIn: 36000 }, (err, token) =>
        res.status(200).json({
            user: payload,
            token: token,
        })
    );
};

exports.loginAdmin = async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username: username, rule: "admin" });

    if (!user)
        return res
            .status(202)
            .json({ message: "Sai tên tài khoản hoặc mật khẩu, hãy thử lại" });
    const passwordMatch = bcrypt.compareSync(password, user.password);

    if (!passwordMatch)
        return res
            .status(202)
            .json({ message: "Sai tên tài khoản hoặc mật khẩu, hãy thử lại" });

    const payload = { id: user._id, username: user.username };
    jwt.sign(payload, keys, { expiresIn: 36000 }, (err, token) =>
        res.status(200).json({
            user: payload,
            token: token,
        })
    );
};
