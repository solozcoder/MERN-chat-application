const Users = require("../database/models/userModel");
const Chats = require("../database/models/chatModel");
const asyncHandler = require("express-async-handler");

const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }

  var findUser = await Users.findOne({
    _id: userId,
  }).select("-password -createdAt -updatedAt -__v");

  if (!findUser) {
    res.status(400);
    throw Error("Cannot find the user!");
  }

  var chatUser = await Chats.findOne({
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  });

  if (chatUser) {
    return res.json(chatUser);
  } else {
    const createdChat = await Chats.create({
      users: [req.user._id, userId],
      chat: [],
      lastestChat,
    });

    return res.status(200).json(createdChat);
  }
});

const sendChatController = asyncHandler(async (req, res) => {
  const { userId, userChat } = req.body;

  if (!userId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }

  var findUser = await Users.findOne({
    _id: userId,
  }).select("-password -createdAt -updatedAt -__v");

  if (!findUser) {
    res.status(400);
    throw Error("Cannot find the user!");
  }

  var chatUser = await Chats.findOne({
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  });

  // var lastestChat = {
  //   _id: req.user._id,
  //   username: req.user.username,
  //   email: req.user.email,
  //   isVerify: req.user.isVerify,
  //   picture: req.user.picture,
  // };

  var lastestChat = "";

  // var setTo = req.user._id === userId ?

  if (userChat) {
    lastestChat = `${req.user.username}: ${userChat}`;
  }

  if (chatUser) {
    if (userChat) {
      var pushChat = await Chats.findOneAndUpdate(
        { _id: chatUser._id },
        {
          $push: {
            chat: {
              sender: req.user,
              message: userChat,
              timestamp: new Date().getTime(),
            },
          },
          lastestChat,
        },
        {
          new: true,
        }
      );

      return res.json(pushChat);
    }
    return res.json(chatUser);
  } else {
    var chatArr = [];
    chatArr.push({
      sender: req.user,
      message: userChat,
      timestamp: new Date().getTime(),
    });

    const createdChat = await Chats.create({
      from: [req.user, findUser],
      users: [req.user._id, userId],
      sender: req.user,
      chat: chatArr,
      lastestChat,
    });

    return res.status(200).json(createdChat);
  }

  return;

  if (userChat) {
    lastestChat.message = userChat;
    lastestChat.timestamp = new Date().getTime();
  }

  if (chatUser) {
    if (userChat) {
      var pushChat = await Chats.findOneAndUpdate(
        {
          $and: [
            {
              users: { $in: req.user._id },
              users: { $in: userId },
            },
          ],
        },
        {
          users: [req.user._id, userId],
          $push: {
            chat: {
              sender: req.user,
              message: userChat,
              timestamp: new Date().getTime(),
            },
          },
          lastestChat,
        },
        {
          new: true,
        }
      );

      return res.status(200).json(pushChat);
    }

    return res.status(200).json(chatUser);
  } else {
    var chatArr = [];
    chatArr.push({
      sender: req.user,
      message: userChat,
      timestamp: new Date().getTime(),
    });

    const createdChat = await Chats.create({
      // from: req.user,
      // to: userId,
      users: [req.user._id, userId],
      sender: req.user,
      chat: chatArr,
      lastestChat,
    });
    return res.status(200).json(createdChat);
  }
});

const fetchChat = asyncHandler(async (req, res) => {
  var chatUser = await Chats.find({
    users: { $elemMatch: { $eq: req.user._id } },
  });

  return res.json(chatUser);
});

const fetchChatById = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  var findUser = await Users.findOne({
    _id: userId,
  }).select("-password -createdAt -updatedAt -__v");

  if (!findUser) {
    res.status(400);
    throw Error("Cannot find user's!");
  }

  var getChatId = await Chats.findOne({
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  });

  var getUser = findUser;
  var chatArr = !getChatId ? [] : getChatId.chat;

  if (getChatId) {
    for (var i = 0; i < getChatId.for.length; i++) {
      if (getChatId.for[i]._id === req.user._id) {
        // console.log(getChatId.for[i].username);
        getUser = getChatId.for[i];
      }
    }
  }

  return res.json({ getUserChat: getUser, getMessageUser: chatArr });
});

const sendChat = asyncHandler(async (req, res) => {
  const { userId, chatData } = req.body;

  var findUser = await Users.findOne({
    _id: userId,
  }).select("-password -createdAt -updatedAt -__v");

  if (!findUser) {
    res.status(400);
    throw Error("Cannot find user's!");
  } else if (!chatData) {
    res.status(400);
    throw Error("Error blank message's!");
  }

  var getChatId = await Chats.findOne({
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  });

  var lastestChat = `${req.user._id}: ${chatData}`;
  var getTime = new Date().getTime();

  var userChat = {
    _id: userId,
    sender: req.user,
    message: chatData,
    timestamp: getTime,
  };

  if (!getChatId) {
    // Create new chat
    var chatArr = [];
    chatArr.push({
      sender: req.user,
      message: chatData,
      timestamp: getTime,
    });

    const createNewChat = await Chats.create({
      for: [req.user, findUser],
      users: [req.user._id, userId],
      chat: chatArr,
      lastestChat,
    });

    // return res.status(200).json(createNewChat);
  } else {
    // Update chat
    var chat = {
      sender: req.user,
      message: chatData,
      timestamp: getTime,
    };

    var pushChat = await Chats.findOneAndUpdate(
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

    // return res.status(200).json(pushChat);
  }

  return res.status(200).json(userChat);
});

// const deleteAllMessage = asyncHandler(async (req, res) => {
//   var { targetUserId } = req.body;

//   var getChatId = await Chats.findOne({
//     $and: [
//       { users: { $elemMatch: { $eq: req.user._id } } },
//       { users: { $elemMatch: { $eq: targetUserId } } },
//     ],
//   });

//   getChatId = getChatId.chat.filter((chat) => chat.sender._id );
// })
// const fetchChat = asyncHandler(async (req, res) => {
//   var getChat = await Chats.find({
//     users: { $elemMatch: { $eq: req.user._id } },
//   });
//   res.json(getChat);
// });

module.exports = { sendChat, fetchChat, fetchChatById };

// module.exports = { sendChatController, fetchChat, fetchChatById };
