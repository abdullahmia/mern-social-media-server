const { genarateToken, verifyToken } = require("../lib/jwt");
const { User } = require("../models/user");
const sendMail = require("../lib/mailer");
const bcrypt = require("bcryptjs");

// register
module.exports.register = async (req, res) => {
    try {
        const { email, fullName, username, password } = req.body;

        // check if user is already exist
        const isEmailUser = await User.findOne({ email });
        const isUsernameUser = await User.findOne({ username });
        if (isEmailUser) {
            return res.status(400).json({ message: "User is alrady exist" });
        }
        if (isUsernameUser) {
            return res
                .status(400)
                .json({ message: "Username is already taken" });
        }

        const hash = await bcrypt.hash(password, 10);

        // create a new user with def following values
        const user = new User({
            email,
            fullName,
            username,
            password: hash,
            following: ["63fa89238373968eaef1f321"],
        });

        // save user
        await user.save();

        return res.send({
            message: "User has been created",
            fullName: user.fullName,
            email: user.email,
            username: user.username,
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// is user exist
module.exports.isExistUser = async (req, res) => {
    try {
        // get username from query
        const { username } = req.query;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(200).json({ isUser: false });
        }

        return res.status(200).json({ isUser: true });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// login
module.exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        let user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: "account not found" });
        }

        // checking if password is correct.
        let isValidPassword = await user.isValidPassword(password);
        if (isValidPassword) {
            const token = await genarateToken(
                {
                    id: user._id,
                    fullName: user.fullNam,
                    username: user.username,
                    email: user.email,
                    image: user.image,
                },
                "7d"
            );

            user = await User.findOne({ _id: user._id }).select("-password");

            return res.send({ user, token });
        } else {
            return res.status(400).json({ message: "Invalid credential" });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// chage password
module.exports.changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword, confirmPassword } = req.body;
        if (oldPassword && newPassword && confirmPassword) {
            if (newPassword === confirmPassword) {
                let user = req.user;
                user = await User.findOne({ _id: user.id, email: user.email });
                let isValidPassword = await user.isValidPassword(oldPassword);
                if (!isValidPassword) {
                    return res.status(401).json({
                        success: false,
                        message: "Old password incorrect.",
                    });
                }

                // hashing the password
                const hash = await bcrypt.hash(confirmPassword, 10);

                user.password = hash;
                await user.save();
                return res.status(200).json({
                    success: true,
                    message: "Password has been chenged",
                });
            } else {
                return res.status(400).json({
                    success: false,
                    message: "Password & confrim password not matched.",
                });
            }
        } else {
            return res.status(400).json({
                error: true,
                message: "Field required.",
            });
        }
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
};

// Password reset email send
module.exports.forgotPasswordEmailSend = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(404).json({ message: "Field required." });
        }

        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({
                error: true,
                message: "User not found with email.",
            });
        }

        const token = await genarateToken(
            { email: user.email, id: user._id },
            "10m"
        );

        const url = `${process.env.CLIENT_URL}/reset-password/${user.id}/${token}`;
        // // send password rest mail
        await sendMail(user.email, "Password reset", url);

        return res.status(200).json({
            message: "Password reset email has been sent on your email.",
        });
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
};

// set new password for a user
module.exports.setPassword = async (req, res) => {
    try {
        const { user, token } = req.params;
        const { newPassword, confirmPassword } = req.body;

        // find the user
        let getUser = await User.findOne({ _id: user });
        const isValidToken = await verifyToken(token);
        if (getUser && isValidToken) {
            if (newPassword === confirmPassword) {
                const hash = await bcrypt.hash(confirmPassword, 10);
                getUser.password = hash;
                await getUser.save();
                return res.status(200).json({
                    message: "Password has been changed",
                });
            } else {
                return res.status(400).json({
                    message: "Password & confrim password not matched.",
                });
            }
        } else {
            return res.status(400).json({
                message: "Invalid password reset link",
            });
        }
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
};
