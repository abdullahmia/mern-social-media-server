const { Schema, model, Types } = require("mongoose");

// chat conversation schema with last message
const conversationSchema = new Schema(
    {
        participants: [
            {
                type: Types.ObjectId,
                ref: "User",
            },
        ],
        lastMessage: {
            type: String,
        },
        // seen
        seen: [
            {
                type: Types.ObjectId,
                ref: "User",
            },
        ],
    },
    { timestamps: true }
);

module.exports = model("Conversation", conversationSchema);
