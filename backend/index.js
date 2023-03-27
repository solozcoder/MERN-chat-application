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
  fetchChat,
  fetchChatById,
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
app.get("/api/chat", AuthUser, fetchChat);
app.get("/api/chat/:userId", AuthUser, fetchChatById);
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

// Error handler
app.use(ErrorHandler);

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

  // (async () => {
  //   console.log("asd");
  //   await Chats.updateMany(
  //     {},
  //     {
  //       $set: {
  //         chat: "",
  //       },
  //     }
  //   );
  // })();

  io.on("connection", (socket) => {
    socket.on("setup", async (data) => {
      socket.join(data._id);
      // console.log(data);

      // Set Status online
      await Users.findOneAndUpdate(
        { _id: data._id },
        {
          status: {
            isOnline: true,
            lastOnline: new Date().getTime(),
          },
        },
        {
          new: true,
        }
      );
      socket.broadcast.emit("userConnected", {
        _id: data._id,
        username: data.username,
        email: data.email,
        picture: data.picture,
        status: {
          isOnline: true,
          lastOnline: new Date().getTime(),
        },
      });
      // console.log(data.username + " join to server");
    });

    socket.on("sendMessage", async (data) => {
      const { _id, sender, message } = data;
      // console.log(data);

      var findUser = await Users.findOne({
        _id,
      }).select("-password -createdAt -updatedAt -__v");

      if (!findUser) {
        throw Error("Cannot find user's!");
      } else if (!message) {
        throw Error("Error blank message's!");
      }

      var getChatId = await Chats.findOne({
        $and: [
          { users: { $elemMatch: { $eq: sender._id } } },
          { users: { $elemMatch: { $eq: _id } } },
        ],
      });
      var lastestChat = `${sender.username}: ${message}`;
      var getCurrentTime = new Date().getTime();
      var chat = {
        chatId: genId,
        sender,
        message,
        timestamp: getCurrentTime,
      };

      var createChat = {};

      if (!getChatId) {
        // Create Chat
        createChat = await Chats.create({
          for: [sender, findUser],
          users: [sender._id, _id],
          chat: [chat],
          lastestChat,
        });
      } else {
        // Update Chat
        createChat = await Chats.findOneAndUpdate(
          { _id: getChatId._id },
          {
            $push: {
              chat,
            },
            lastestChat,
          },
          {
            new: true,
          }
        );
      }

      // data._id = createChat._id;
      data.timestamp = getCurrentTime;
      socket.to(_id).emit("receiveMessage", createChat);
      // socket.in(_id)
    });

    // socket.on("disconnect", () => {});
  });
});
