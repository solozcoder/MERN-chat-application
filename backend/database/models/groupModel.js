const mongoose = require("mongoose");

const messageModel = mongoose.Schema(
  {
    groupName: { type: String },
    groupAdmin: { type: Array },
    groupPerson: [{ type: mongoose.Schema.Types.ObjectId, ref: "person" }],
    lastestChat: { type: String },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageModel);
module.exports = Message;
