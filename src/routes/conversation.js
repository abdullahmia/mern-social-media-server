const router = require("express").Router();

const {
    createConversation,
    getConversations,
} = require("../controllers/conversationController");
const { isLoggedIn } = require("../middlewares/auth");

router
    .route("/")
    .get(isLoggedIn, getConversations)
    .post(isLoggedIn, createConversation);

module.exports = router;
