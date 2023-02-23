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
    },
    { timestamps: true }
);

module.exports = model("Conversation", conversationSchema);
