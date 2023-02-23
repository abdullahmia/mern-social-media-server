const { Schema, model, Types } = require("mongoose");

// message schema
const messageSchema = new Schema(
    {
        sender: {
            type: Types.ObjectId,
            ref: "User",
        },
        receiver: {
            type: Types.ObjectId,
            ref: "User",
        },
        text: {
            type: String,
            required: true,
        },
        conversationId: {
            type: Types.ObjectId,
            ref: "Conversation",
        },
        attachment: {
            type: String,
        },
    },
    { timestamps: true }
);

module.exports = model("Message", messageSchema);
