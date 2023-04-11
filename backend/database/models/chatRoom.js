const mongoose = require("mongoose");

const chatRoomSchema = new mongoose.Schema(
  {
    users: [{ type: Object, ref: "users" }],
    chatRoom: [{ type: mongoose.Schema.Types.ObjectId, ref: "room" }],
    lastestChat: { type: String },
  },
  {
    timestamps: true,
  }
);

const ChatRoom = mongoose.model("chatroom", chatRoomSchema);
module.exports = ChatRoom;
