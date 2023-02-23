const router = require("express").Router();

const { getMessages, addMessage } = require("../controllers/messageController");
const { isLoggedIn } = require("../middlewares/auth");

router
    .route("/:conversationId")
    .get(isLoggedIn, getMessages)
    .post(isLoggedIn, addMessage);

module.exports = router;
