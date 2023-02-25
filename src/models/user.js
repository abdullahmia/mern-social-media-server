const { Schema, model, Types } = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            uniqe: true,
        },
        fullName: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: true,
            uniqe: true,
        },
        password: {
            type: String,
            required: true,
        },
        image: {
            type: String,
        },
        phone: {
            type: String,
        },
        gender: {
            type: String,
            enum: ["male", "female"],
            default: "male",
        },
        website: {
            type: String,
        },
        bio: {
            type: String,
        },
        followers: [
            {
                type: Types.ObjectId,
                ref: "User",
            },
        ],
        following: [
            {
                type: Types.ObjectId,
                ref: "User",
            },
        ],
        isDeactivate: {
            type: Boolean,
            default: false,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        isLock: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

// validate the password
userSchema.methods.isValidPassword = async function (password) {
    const user = this;
    const compare = await bcrypt.compare(password, user.password);
    return compare;
};

const User = model("User", userSchema);
module.exports = { User };
