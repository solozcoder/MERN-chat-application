const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    chatId: { type: mongoose.Schema.Types.ObjectId },
    sender: { type: Object, ref: "sender" },
    message: { type: String, ref: "message" },
  },
  {
    timestamps: true,
  }
);

const Chats = mongoose.model("Chats", chatSchema);
module.exports = Chats;
