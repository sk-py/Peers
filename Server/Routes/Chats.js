const express = require("express");

const {
  newChat,
  fetchConversationsList,
  fetchMessages,
  sendMessages,
} = require("../Controllers/Chats");

const router = express.Router();

router.post("/newchat", newChat);

router.get("/chats/:userId", fetchConversationsList);

router.get("/messages/:conversationId", fetchMessages);

router.post("/messages", sendMessages);

module.exports = router;
