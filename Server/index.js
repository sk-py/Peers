const express = require("express");
const app = express();
const cors = require("cors");

require("./Connection");
require("dotenv").config();
const PORT = process.env.PORT;

//* Socket Integration
require("./Utils/SocketConfig");

//* Essential MiddleWares
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

//* Route imports
const authRoutes = require("./Routes/Auth");
const chatRoutes = require("./Routes/Chats");
const userUtilRoutes = require("./Routes/Users");
const requestRoutes = require("./Routes/Requests");

// *** Auth Routes -- includes register/login
app.use(authRoutes);

// *** Chat Routes -- includes New Convo creation / Fetching Conversations / Creating or Sending Messages / Fetching Messages
app.use(chatRoutes);

// *** User related utility routes -- includes Searching / creating Friend Requests / Fetching & Uploading Profile Images
app.use(userUtilRoutes);

app.use("/api/request", requestRoutes);

app.listen(PORT, () => {
  console.log(`Server Started On ${PORT} `);
});
