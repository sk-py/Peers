const requestModel = require("../Models/Requests");
const users = require("../Models/Users");
const conversations = require("../Models/conversations");
const Messages = require("../Models/messages");

const newChat = async (req, res) => {
  try {
    const { senderId, receiverId, action } = req.body;

    // const isAvailable = await conversations.find({
    //   $and: [{ members: senderId }, { members: receiverId }],
    // });
    // console.log("isAvailable", isAvailable.length);
    // if (isAvailable.length > 0) {
    //   res.status(409).json("Already Available");
    // }
    console.log("Data : ", receiverId, senderId);
    if (action == "Dismiss") {
      const response = await requestModel.deleteOne({
        senderId: receiverId,
        receiverId: senderId,
      });
      console.log("Response from request delete ", response);
      res.status(200).json("Request dismissed");
    } else {
      const newConversation = await conversations.create({
        members: [senderId, receiverId],
      });

      const response = await requestModel.deleteOne({
        senderId: receiverId,
        receiverId: senderId,
      });
      if (!newConversation) {
        res.status(400).json("Unexpected error occurred please try again");
      }
      res.status(201).json("Added successfully");
    }
  } catch (error) {
    console.log("error from /newchat :", error.message);
  }
};

const fetchConversationsList = async (req, res) => {
  try {
    const userId = req.params.userId;
    const Conversations = await conversations.find({
      members: { $in: [userId] },
    });

    const conversationsList = Promise.all(
      Conversations.map(async (conversation) => {
        const receiverId = conversation.members.find(
          (member) => member !== userId
        );

        if (!receiverId) {
          // Handle the case where receiverId is not found
          return null;
        }

        const user = await users.findById(receiverId);

        if (!user) {
          // Handle the case where user is not found
          return null;
        }

        return {
          user: {
            fullName: user.fullName,
            email: user.email,
            id: user._id,
          },
          conversationId: conversation._id,
        };
      })
    );

    // Filtering out null values before sending the response
    const filteredConversationsList = (await conversationsList).filter(
      (conversation) => conversation !== null
    );

    res.status(200).json(filteredConversationsList);
  } catch (error) {
    console.log("error from /chats/:userId :", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const fetchMessages = async (req, res) => {
  try {
    const conversationId = req.params.conversationId;
    const messages = await Messages.find({ conversationId });
    const messageUserData = Promise.all(
      messages.map(async (message) => {
        const user = await users.findById(message.senderId);
        return {
          user: {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
          },
          message: message.message,
          messageId: message._id,
        };
      })
    );
    messages.length > 0 ? res.json(await messageUserData) : res.json([]);
  } catch (error) {
    console.error("Error from /message/:conversationId script ", error.message);
  }
};

const sendMessages = async (req, res) => {
  try {
    const { conversationId, senderId, message } = req.body;
    const newMessage = new Messages({
      conversationId,
      senderId,
      message,
    });
    await newMessage.save();
    res.status(200).json("Message Sent Successfully..!");
  } catch (error) {
    console.error("error from /message script :", error.message);
  }
};

module.exports = {
  newChat,
  fetchConversationsList,
  fetchMessages,
  sendMessages,
};
