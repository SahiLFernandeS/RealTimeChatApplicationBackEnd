const express = require("express");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
} = require("../controllers/chatController");
const { protect } = require("../middleware/authenticateUser");

const router = express.Router();

router.route("/").post(protect, accessChat).get(protect, fetchChats);
// router.route("/group").post(protect, createGroupChat);
// router.route("/renameGroup").put(protect, renameGroup);
// router.route("/addToGroup").put(protect, addToGroup);
// router.route("/removeFromGroup").put(protect, removeFromGroup);

module.exports = router;
