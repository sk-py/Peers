const requestModel = require("../Models/Requests");
const conversations = require("../Models/conversations");

const createRequest = async (req, res) => {
  try {
    const { senderId, senderName, receiverId, receiverName } = req.body;
    // console.log("Data :", senderId, senderName, receiverId, receiverName);

    const isAvailable = await conversations.find({
      $and: [{ members: senderId }, { members: receiverId }],
    });

    const requested = await requestModel.find({
      senderId: senderId,
      receiverId: receiverId,
    });
    // console.log(requested);
    if (isAvailable.length > 0 || requested.length > 0) {
      return res.status(400).json("Already available or requested");
    } else {
      const newRequest = await requestModel.create({
        senderId: senderId,
        senderName: senderName,
        receiverId: receiverId,
        receiverName: receiverName,
      });
      if (!newRequest) {
        return res.status(400).json("Creating request failed");
      }
      res.status(201).json("Request created successfullly");
    }
  } catch (error) {
    console.log("Error from createRequest : ", error.message);
  }
};
const displayRequest = async (req, res) => {
  const userId = req.params;
  try {
    const requests = await requestModel.find({ receiverId: userId.id });
    if (!requests) {
      res.json("No pending requests");
    }
    res.status(200).json(requests);
  } catch (error) {
    console.log(error.message);
  }
};
module.exports = { createRequest, displayRequest };
