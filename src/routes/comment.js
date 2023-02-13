const { addComment } = require("../controllers/commentController");
const { isLoggedIn } = require("../middlewares/auth");

const router = require("express").Router();

router.route("/").post(isLoggedIn, addComment);

module.exports = router;
