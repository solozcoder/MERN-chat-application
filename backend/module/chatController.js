const Users = require("../database/models/userModel");
const Chats = require("../database/models/chatModel");
const asyncHandler = require("express-async-handler");
const ChatRoom = require("../database/models/chatRoom");
const { verifyUser } = require("./verifyUser");

// Fetching message from friend
const getFriendChat = asyncHandler(async (req, res) => {
  // Find chat room
  var findChatRoom = await ChatRoom.find({
    chatRoom: { $elemMatch: { $eq: req.user._id } },
  });

  // Then return to client
  return res.json(findChatRoom);
});

// Fetch message from friend
const getChatByRoomId = asyncHandler(async (req, res) => {
  const { chatId } = req.params;

  if (!chatId) return;

  const getMessage = await Chats.find({
    chatId,
  });

  var chatArr = getMessage.length === 0 ? [] : getMessage;

  return res.status(200).json(chatArr);
});

const getRoomById = asyncHandler(async (req, res) => {
  const { roomId } = req.params;

  const getRoomID = await ChatRoom.find({
    _id: roomId,
  });

  console.log(getRoomID);

  var roomArr = getRoomID.length === 0 ? [] : getRoomID;

  // if (!getRoomID) {
  //   res.status(404);
  //   throw Error("Not Found The Room ID.");
  // }

  return res.status(200).json(roomArr);
});

// Send Chat
const sendChat = asyncHandler(async (req, res) => {
  const { chatId, userId, message } = req.body;

  var verUser = await verifyUser(userId);

  var findRoom = await ChatRoom.findOne({
    _id: chatId,
  });

  var lastestChat = `${message}`;
  // var getTime = new Date().getTime();

  if (!findRoom) {
    // Create Room
    findRoom = await ChatRoom.create({
      users: [req.user, verUser],
      chatRoom: [req.user._id, userId],
      lastestChat,
    });
  } else {
    // Update lastest chat
    await ChatRoom.findOneAndUpdate(
      {
        _id: findRoom._id,
      },
      {
        lastestChat,
      }
    );
  }

  // Create Message
  const newMessage = await Chats.create({
    chatId: findRoom._id,
    sender: req.user,
    message,
  });

  return res.status(200).json(newMessage);
});

module.exports = { getFriendChat, getChatByRoomId, getRoomById, sendChat };
