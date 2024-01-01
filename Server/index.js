const express = require("express");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const io = require("socket.io")(8080, {
  cors: {
    origin: "http://localhost:5173",
  },
});

const PORT = 5000 || process.env;

//Imports
const users = require("./Models/Users");
const requestRoutes = require("./Routes/Requests");
const conversations = require("./Models/conversations");
const Messages = require("./Models/messages");
const requestModel = require("./Models/Requests");

require("./Connection");
require("dotenv");

//MiddleWares
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/api/request", requestRoutes);

//Multer configuration
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileName = uniqueSuffix + "-" + file.originalname;
    cb(null, fileName);
    req.body = fileName;
  },
});
const upload = multer({ storage: storage });

// Socket Integration

let usersArray = [];
try {
  io.on("connection", (socket) => {
    console.log(`User Connected${socket.id}`);
    socket.on("addUser", (userId) => {
      const isExist = usersArray.find((user) => user.userId === userId);
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

    socket.on("disconnect", () => {
      usersArray = usersArray.filter((user) => user.socketId !== socket.id);
      io.emit("availableUsers", usersArray);
      console.log("userDisconnected", socket.id);
      console.log("User Array from disconnect", usersArray);
    });
  });
} catch (error) {
  console.log("Error from socket program ", error.message);
}

//Routes

app.get("/", (req, res) => {
  res.json("OK");
});

app.post("/register", async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      res.status(400).json({
        message: "All the fields are required \n please fill all of them.",
      });
    } else {
      const alreadyExist = await users.findOne({ email });
      if (alreadyExist) {
        res.status(400).json({
          message: "Email Already Exists..! Login If You Have An Account",
        });
      } else {
        try {
          const user = new users({
            fullName,
            email,
          });
          bcrypt.hash(password, 10, (error, result) => {
            user.set("password", result);
            user.save();
            res.status(201).json("User Created Successfully");
          });
        } catch (error) {
          console.log(error.message);
        }
      }
    }
  } catch (error) {
    console.log("Error in register script ", error.message);
  }
});

app.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        message: "Please Fill All The Fields: i.e., Email and Password",
      });
    } else {
      const userExists = await users.findOne({ email: email });

      if (!userExists) {
        res.status(400).json({ message: "Email Not Registered" });
      } else {
        const validated = await bcrypt.compare(password, userExists.password);

        if (!validated) {
          res.status(400).json({ message: "Invalid Email OR Password" });
        } else {
          const payload = {
            userId: userExists._id,
            email: userExists.email,
          };

          const JWT_SECRET_KEY =
            "THIS_IS_JWT_SECRET_KEY" || process.env.JWT_SECRET_KEY;

          // Generate JWT token

          const token = await jwt.sign(payload, JWT_SECRET_KEY, {
            expiresIn: "12h",
          });
          userExists.token = token;
          userExists.save();
          res.json({
            user: {
              email: userExists.email,
              name: userExists.fullName,
              id: userExists._id,
            },
            token: { token: userExists.token },
          });
          // .render("/");
        }
      }
    }
  } catch (error) {
    console.error("Error from login script : ", error.message);
    res.status(500).json("Internal Server Error");
  }
});

app.post("/newchat", async (req, res) => {
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
});

app.get("/chats/:userId", async (req, res) => {
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

    // Filter out null values before sending the response
    const filteredConversationsList = (await conversationsList).filter(
      (conversation) => conversation !== null
    );

    res.status(200).json(filteredConversationsList);
  } catch (error) {
    console.log("error from /chats/:userId :", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/messages", async (req, res) => {
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
});

app.get("/messages/:conversationId", async (req, res) => {
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
});

app.get("/users/:name", async (req, res) => {
  try {
    const searchQuery = req.params.name;
    const regex = new RegExp(searchQuery, "i");
    // console.log(regex);
    const UsersList = await users.find({ fullName: { $regex: regex } });
    const Users = await UsersList.map((user) => {
      return {
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          //Profile Pic And Other Details Will Come Here While Searching Except Password
        },
      };
    });
    res.json(Users);
  } catch (error) {
    console.log("Error from search script /users/:name :", error.message);
  }
});

app.post("/api/upload", upload.single("ImgInput"), async (req, res) => {
  const { fileName, userId } = req.body;
  // console.log("fileName", fileName);
  try {
    const upload = await users.findOneAndUpdate(
      { _id: userId },
      { profileUrl: fileName }
    );
    res.status(200).json("Profile pic uploaded successfully");
  } catch (error) {
    console.log("Error from /api/upload : ", error.message);
  }
});

app.listen(PORT, () => {
  console.log(`Server Started On ${PORT}`);
});
