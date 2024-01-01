const mongoose = require("mongoose");
const requestSchema = mongoose.Schema(
  {
    senderId: {
      type: String,
    },
    senderName: {
      type: String,
    },
    receiverId: {
      type: String,
    },
    receiverName: {
      type: String,
    },
  },
  { timestamps: true }
);

const requestModel = mongoose.model("requests", requestSchema);

module.exports = requestModel;
