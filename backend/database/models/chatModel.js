const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    for: [{ type: Object, ref: "from" }],
    // for: { type: Object },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }],
    chat: { type: Array, ref: "Chats" },
    lastestChat: { type: String },
  },
  {
    timestamps: true,
  }
);

const Chats = mongoose.model("Chats", chatSchema);
module.exports = Chats;
