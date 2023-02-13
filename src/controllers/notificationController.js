const Notification = require("../models/notificationModel");

module.exports.getAllNotifications = async (req, res) => {
    try {
        const user = req.user;
        const notifications = await Notification.find({ recipient: user.id });
        return res.status(200).json(notifications);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};
