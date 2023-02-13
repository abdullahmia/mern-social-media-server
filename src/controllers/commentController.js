const Comment = require("../models/comment");
const Notification = require("../models/notificaiton");

module.exports.addComment = async (req, res) => {
    try {
        const userId = req.user.id;
        const { post, comment } = req.body;

        let newComment = new Comment({ post, user: userId, comment });
        await newComment.save();

        let getComment = await newComment.populate(
            "post user",
            "-email -fullName -password -gender -followers -following -isDeactivate -isLock -website -bio -phone -createdAt -updatedAt -_v"
        );

        // create a notification
        let notification = new Notification({
            sender: userId,
            recipient: getComment.post.user,
            type: "comment",
            link: `/p/${getComment.post._id}`,
        });

        notification = await notification.populate(
            "recipient sender",
            "-email -fullName -password -gender -followers -following -isDeactivate -isLock -website -bio -phone -createdAt -updatedAt -_v"
        );

        await notification.save();

        // send notification to the user
        global.io.emit("notification", notification);

        return res.status(201).json(getComment);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
};
