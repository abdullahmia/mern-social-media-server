const router = require("express").Router();

const {
    createPost,
    getPosts,
    like,
    unlike,
    getPost,
} = require("../controllers/postController");
const multer = require("../lib/multer");

const { isLoggedIn } = require("../middlewares/auth");

router
    .route("/")
    .post([isLoggedIn, multer.single("image")], createPost)
    .get(isLoggedIn, getPosts);

router.route("/:postId").get(isLoggedIn, getPost);

router.patch("/like/:id", isLoggedIn, like);
router.patch("/unlike/:id", isLoggedIn, unlike);

module.exports = router;
