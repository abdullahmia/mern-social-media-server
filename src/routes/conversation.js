const router = require("express").Router();

const { createConversation } = require("../controllers/conversationController");
const { isLoggedIn } = require("../middlewares/auth");

router.post("/", isLoggedIn, createConversation);

module.exports = router;
