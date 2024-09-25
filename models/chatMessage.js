const mongoose = require("mongoose");

const chatMessageSchema = new mongoose.Schema({
  _thread: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ChatThread",
    required: true,
  },

  _from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  _to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  text: {
    type: String,
  },

  isRead: {
    type: Boolean,
    default: false,
  },

  createdAt: {
    type: Date,
  },
});

module.exports = mongoose.model("ChatMessage", chatMessageSchema);
