const express = require("express");
const { accessChat } = require("../controllers/chatController");
const { protect } = require("../middleware/authenticateUser");

const router = express.Router();

router.route("/").post(protect, accessChat);

module.exports = router;
