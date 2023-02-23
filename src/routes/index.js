const router = require("express").Router();

router.use("/auth", require("./auth"));
router.use("/user", require("./user"));
router.use("/post", require("./post"));
router.use("/comment", require("./comment"));
router.use("/notification", require("./notification"));
router.use("/conversation", require("./conversation"));
router.use("/message", require("./message"));

module.exports = router;
