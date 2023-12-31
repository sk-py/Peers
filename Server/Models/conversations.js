const mongoose = require("mongoose");
const conversationSchema = mongoose.Schema({
  members: {
    type: [],
    required: true,
  },
});
const conversations = mongoose.model("conversations", conversationSchema);
module.exports = conversations;
