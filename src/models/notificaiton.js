const { Schema, model, Types } = require("mongoose");

// make a notification schema with isRead, type, and user
const notificationSchema = new Schema(
    {
        recipient: {
            type: Types.ObjectId,
            ref: "User",
        },
        sender: {
            type: Types.ObjectId,
            ref: "User",
        },
        type: {
            type: String,
            enum: ["like", "comment", "follow"],
        },
        isRead: {
            type: Boolean,
            default: false,
        },
        link: {
            type: String,
        },
    },
    { timestamps: true }
);

const Notification = model("Notification", notificationSchema);
module.exports = Notification;
