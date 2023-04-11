// Modules
require("dotenv").config();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const {
  LoginAuth,
  RegisterAuth,
  UserQuery,
  AuthUser,
} = require("./module/userController");

const {
  sendChat,
  getFriendChat,
  getChatByRoomId,
  getRoomById,
} = require("./module/chatController");

const {
  createGroup,
  editGroup,
  deleteGroup,
  addUserGroup,
  removeUserGroup,
} = require("./module/groupController");

const ErrorHandler = require("./middleware/ErrorHandler");

const { chats } = require("./data/data");

// Database
const mongoose = require("mongoose");
var genId = new mongoose.Types.ObjectId();
const User = require("./database/models/userModel");
const database = require("./database/db_connect");

// Express
const express = require("express");
const app = express();
var port = process.env.PORT || 5000;

// Socket IO
const socket = require("socket.io");
const Users = require("./database/models/userModel");
const Chats = require("./database/models/chatModel");
const ChatRoom = require("./database/models/chatRoom");
const { verifyUser } = require("./module/verifyUser");

app.use(cookieParser());
app.use(bodyParser.json());
app.use(
  cors({
    origin: true,
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

// app.use(AuthUser);

app.get("/", (req, res) => {
  return res.status(200).send("API is running!");
});

// Chat
app.get("/api/chat/getFriend", AuthUser, getFriendChat);
app.get("/api/chatroom/:roomId", AuthUser, getRoomById);
app.get("/api/chat/:chatId", AuthUser, getChatByRoomId);
app.post("/api/chat", AuthUser, sendChat);

// User
app.get("/api/users", AuthUser, UserQuery);

// Auth
app.post("/api/login", LoginAuth);
app.post("/api/register", RegisterAuth);
app.post("/api/auth", AuthUser);

// Group
// app.post("/group/create", AuthUser, createGroup);
// app.put("/group/edit/:groupId", AuthUser, editGroup);
// app.put("/group/delete-group/:groupId", AuthUser, deleteGroup);

// app.put("/group/add-user/:id", AuthUser, addUserGroup);
// app.delete("/group/remove-user/:id", AuthUser, removeUserGroup);

// app.post("/auth/signin", SignInAuth);
// app.post("/auth/user", SignInAuth);

database.getConnection((err) => {
  if (err) return console.log(`[-] Database Error: ${err}`);

  var server = app.listen(
    port,
    console.log(`[+] Server running on port: ${port}`)
  );

  const io = socket(server, {
    cors: {
      origin: true,
      methods: "GET,POST,PUT,DELETE",
      credentials: true,
    },
  });

  var users = [];
  io.on("connection", (socket) => {
    socket.on("setup", (data) => {
      socket.join(data._id);
    });

    // Catch user send message
    socket.on("sendMessage", async (data) => {
      const { chatId, userId, sender, message } = data;

      socket.to(userId).emit("receiveMessage", {
        chatId,
        sender,
        message,
      });
    });
  });
});

// Error handler
// app.use(ErrorHandler);
