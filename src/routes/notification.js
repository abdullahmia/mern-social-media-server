const {
    getAllNotifications,
} = require("../controllers/notificationController");
const { isLoggedIn } = require("../middlewares/auth");

const router = require("express").Router();

router.get("/", isLoggedIn, getAllNotifications);

module.exports = router;
