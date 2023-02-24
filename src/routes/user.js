const {
    getUser,
    updateProfile,
    uploadProfilePicture,
    suggestedUsers,
    follow,
    unfollow,
    getFollowers,
    searchUser,
} = require("../controllers/userContoller");
const uploader = require("../lib/multer");
const { isLoggedIn } = require("../middlewares/auth");

const router = require("express").Router();

router.get("/user/:username", isLoggedIn, getUser);
router.get("/suggested", isLoggedIn, suggestedUsers);
router.patch("/update-profile", isLoggedIn, updateProfile);

router.patch(
    "/upload-profile-picture",
    isLoggedIn,
    uploader.single("image"),
    uploadProfilePicture
);

router.patch("/follow/:id", isLoggedIn, follow);
router.patch("/unfollow/:id", isLoggedIn, unfollow);
router.route("/followers").get(isLoggedIn, getFollowers);

// search user by username
router.get("/search", isLoggedIn, searchUser);

module.exports = router;
