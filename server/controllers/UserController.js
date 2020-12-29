const User = require("../models/User");

exports.getListUser = async (req, res) => {
    const result = await User.find({ rule: "user" },{password:0})
        .lean()
        .catch((err) => {
            res.status(500).json({
                message: "Không thể tìm thấy danh sách user!",
            });
        });
    return res.status(200).json({ result: result });
};

exports.getUser = async (req, res) => {
    const { id } = req.query;
    await User.findOne({ _id: id },{password:0})
        .lean()
        .then((result) => {
            return res.status(200).json({ result: result });
        })
        .catch((err) => {
            console.log("Lỗi xảy ra!");
            return res
                .status(404)
                .json({ message: "Không tìm thấy người dùng này!" });
        });
};
