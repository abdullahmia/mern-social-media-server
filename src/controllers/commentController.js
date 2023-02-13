const Comment = require("../models/comment");

module.exports.addComment = async (req, res) => {
    try {
        const userId = req.user.id;
        const { post, comment } = req.body;

        let newComment = new Comment({ post, user: userId, comment });
        await newComment.save();

        return res.status(201).json(newComment);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
};
