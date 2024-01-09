const users = require("../Models/Users");
const conversations = require("../Models/conversations");

const io = require("socket.io")(8080, {
  cors: {
    origin: "http://localhost:5173",
  },
});

const SocketConfigs = async () => {
  let usersArray = [];
  try {
    io.on("connection", (socket) => {
      console.log(`User Connected${socket.id}`);
      socket.on("addUser", async (userId) => {
        const isExist = await usersArray.find((user) => user.userId === userId);
        const updatedStatus = await users.findOneAndUpdate(
          { _id: userId },
          { status: "1" }
        );
        if (!isExist) {
          const user = { userId, socketId: socket.id };
          usersArray.push(user);
          io.emit("availableUsers", usersArray);
        }
        console.log("User Array from connect ", usersArray);
      });

      socket.on(
        "sendMessage",
        async ({ conversationId, senderId, message, fullName, email }) => {
          const Receiver = await conversations.findOne({ _id: conversationId });
          const recId = Receiver.members.filter((id) => id !== senderId);
          const sender = Receiver.members.filter((id) => id == senderId);
          const receiverId = recId[0];
          const sendersId = sender[0];
          const receiverObj = await usersArray.find(
            (user) => user.userId === receiverId
          );
          const senderObj = await usersArray.find(
            (user) => user.userId === sendersId
          );
          console.log(receiverObj);
          console.log(fullName, email);
          if (receiverObj) {
            io.to(receiverObj.socketId)
              .to(senderObj.socketId)
              .emit("getMessage", {
                senderId,
                message,
                fullName,
                email,
                conversationId,
              });

            console.log("receiverId", recId[0]);
            console.log("senderId", senderId);
            console.log("message", message);
          } else {
            io.to(senderObj.socketId).emit("getMessage", {
              senderId,
              message,
              fullName,
              email,
              conversationId,
            });
          }
        }
      );

      socket.on("disconnect", async () => {
        const NewUsersArray = usersArray.find(
          (user) => user.socketId == socket.id
        );
        console.log("NewUsersArray", NewUsersArray);
        try {
          const updatedStatus = await users.findOneAndUpdate(
            { _id: NewUsersArray.userId },
            { status: "0" }
          );
        } catch (error) {
          console.log("Error in socket-disconnect", error.message);
        }
        usersArray = usersArray.filter((user) => user.socketId !== socket.id);
        io.emit("availableUsers", usersArray);
        console.log("userDisconnected", socket.id);
        console.log("User Array from disconnect", usersArray);
      });
    });
  } catch (error) {
    console.log("Error from socket program ", error.message);
  }
};

SocketConfigs();

module.exports = { SocketConfigs };
