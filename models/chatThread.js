const mongoose = require("mongoose");

const chatThreadSchema = new mongoose.Schema({
  _participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  lastMessage: {
    type: String,
  },

  lastMessageTime: {
    type: Date,
  },

  isAllowed: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("ChatThread", chatThreadSchema);
