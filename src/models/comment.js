const { Schema, model, Types } = require("mongoose");

const commentSchema = new Schema(
    {
        post: {
            type: Types.ObjectId,
            ref: "Post",
            required: true,
        },
        user: {
            type: Types.ObjectId,
            ref: "User",
            required: true,
        },
        comment: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = model("Comment", commentSchema);
