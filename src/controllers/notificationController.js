const Notification = require("../models/notificaiton");

module.exports.getAllNotifications = async (req, res) => {
    try {
        const user = req.user;
        const notifications = await Notification.find({
            recipient: user.id,
        }).populate(
            "sender",
            "-email -fullName -password -gender -followers -following -isDeactivate -isLock -website -bio -phone -createdAt -updatedAt -_v"
        );

        // total unread notifications
        const unreadNotifications = await Notification.find({
            recipient: user.id,
            isRead: false,
        }).count();

        return res.status(200).json({ notifications, unreadNotifications });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// read all of notification
module.exports.readNotifications = async (req, res) => {
    try {
        let user = req.user;
        await Notification.updateMany({ recipient: user.id }, { isRead: true });
        return res.status(200).json({ message: "Read all notifications" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};
