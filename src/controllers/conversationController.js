const Conversation = require("../models/conversation");
const Message = require("../models/message");

// create a new conversation
module.exports.createConversation = async (req, res) => {
    try {
        const user = req.user;
        const { receiverId, message } = req.body;
        const newConversation = new Conversation({
            participants: [user.id, receiverId],
            lastMessage: message,
            seen: [user.id],
        });

        const savedConversation = await (
            await newConversation.save()
        ).populate("participants", "username profilePicture fullName image");

        // add message to message model
        const newMessage = new Message({
            sender: user.id,
            receiver: receiverId,
            text: message,
            conversationId: savedConversation._id,
        });

        await newMessage.save();

        global.io.emit("newConversation", savedConversation);

        return res.status(200).json(savedConversation);
    } catch (err) {
        return res.status(500).json(err.message);
    }
};

// get user conversations
module.exports.getConversations = async (req, res) => {
    try {
        const user = req.user;
        // get the user conversation
        const conversations = await Conversation.find({
            participants: { $in: [user.id] },
        })
            .populate("participants", "username profilePicture fullName image")
            .sort({ updatedAt: -1 });

        return res.status(200).json(conversations);
    } catch (err) {
        return res.status(500).json(err.message);
    }
};

// seen conversation
module.exports.seenConversation = async (req, res) => {
    try {
        const conversationId = req.params.conversationId;
        const user = req.user;

        const conversation = await Conversation.findById(conversationId);

        if (!conversation) {
            return res.status(404).json("Conversation not found");
        }

        if (!conversation.seen.includes(user.id)) {
            conversation.seen.push(user.id);
            await conversation.save();
        }

        return res.status(200).json(conversation);
    } catch (err) {
        return res.status(500).json(err.message);
    }
};
