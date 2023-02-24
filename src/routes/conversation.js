const router = require("express").Router();

const {
    createConversation,
    getConversations,
    seenConversation,
} = require("../controllers/conversationController");
const { isLoggedIn } = require("../middlewares/auth");

router
    .route("/")
    .get(isLoggedIn, getConversations)
    .post(isLoggedIn, createConversation);

router.route("/:conversationId").patch(isLoggedIn, seenConversation);

module.exports = router;
