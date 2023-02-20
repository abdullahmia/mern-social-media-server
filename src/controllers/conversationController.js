const Conversation = require("../models/conversation");

// create a new conversation
module.exports.createConversation = async (req, res) => {
    try {
        const newConversation = new Conversation({
            participants: [req.body.senderId, req.body.receiverId],
        });

        const savedConversation = await newConversation.save();
        return res.status(200).json(savedConversation);
    } catch (err) {
        return res.status(500).json(err.message);
    }
};
