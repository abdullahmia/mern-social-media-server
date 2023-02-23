const Message = require("../models/message");
const Conversation = require("../models/conversation");

// get messages
module.exports.getMessages = async (req, res) => {
    try {
        const conversationId = req.params.conversationId;
        const messages = await Message.find({
            conversationId,
        }).populate(
            "sender receiver",
            "username profilePicture fullName image"
        );

        return res.status(200).json(messages);
    } catch (err) {
        return res.status(500).json(err.message);
    }
};

// add message
module.exports.addMessage = async (req, res) => {
    try {
        const conversationId = req.params.conversationId;
        const { sender, receiver, text } = req.body;

        if (!sender || !receiver || !text) {
            return res.status(422).json("Please add all the fields");
        }

        // check if conversation exists
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            return res.status(404).json("Conversation not found");
        }

        // add message to message model
        const newMessage = new Message({
            sender: sender,
            receiver: receiver,
            text,
            conversationId,
        });

        const savedMessage = await (
            await newMessage.save()
        ).populate("sender receiver", "username profilePicture fullName image");

        // update conversation last message
        conversation.lastMessage = text;
        await conversation.save();

        global.io.emit("newMessage", savedMessage);

        return res.status(200).json(newMessage);
    } catch (err) {
        return res.status(500).json(err.message);
    }
};
