const {
    getAllNotifications,
    readNotifications,
} = require("../controllers/notificationController");
const { isLoggedIn } = require("../middlewares/auth");

const router = require("express").Router();

router.get("/", isLoggedIn, getAllNotifications);
router.patch("/read", isLoggedIn, readNotifications);

module.exports = router;
