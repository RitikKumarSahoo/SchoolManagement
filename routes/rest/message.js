const User = require("../../models/user");
const School = require("../../models/school");
const Class = require("../../models/class");
const Attendance = require("../../models/attendance");
const moment = require("moment");
const ChatThread = require("../../models/chatThread");
const ChatMessage = require("../../models/chatMessage");

module.exports = {
  async messagePermission(req, res) {
    const { userId, enable } = req.body;
    const { id } = req.user;

    try {
      const admin = await User.findOne({ _id: id, loginType: "admin" });
      if (admin === null) {
        return res
          .status(403)
          .json({ error: true, message: "You are not an admin." });
      }

      const user = await User.findOne({ _id: userId });
      if (user === null) {
        return res
          .status(404)
          .json({ error: true, message: "User not found." });
      }

      user.messagingEnabled = enable;
      await user.save();

      return res.status(200).json({
        error: false,
        message: `Messaging has been ${
          enable ? "enabled" : "disabled"
        } for user ${userId}.`,
        user,
      });
    } catch (error) {
      return res.status(500).json({ error: true, message: error.message });
    }
  },

  // send message
  async sendMessage(req, res) {
    const { text, _to } = req.body;
    const { id } = req.user;
    // const { threadId } = req.params;

    try {
      // Check if the sender exists
      const sender = await User.findOne({ _id: id });
      if (!sender) {
        return res
          .status(404)
          .json({ error: true, message: "Sender not found." });
      }

      // Check if the receiver exists
      const receiver = await User.findOne({ _id: _to });
      if (!receiver) {
        return res
          .status(404)
          .json({ error: true, message: "Receiver not found." });
      }

      if (sender.loginType === "student") {
        if (!sender.messagingEnabled) {
          return res.status(403).json({
            error: true,
            message: "Messaging is disabled for the student",
          });
        }

        if (receiver.loginType !== "admin") {
          return res
            .status(403)
            .json({ error: true, message: "Students can only message admin" });
        }
      }

      const thread = await ChatThread.findOne({
        _participants: { $all: [id, _to] },
      });
      if (!thread) {
        return res
          .status(404)
          .json({ error: true, message: "Chat thread not found." });
      }

      const message = await ChatMessage.create({
        _thread: thread._id,
        _from: sender._id,
        _to,
        text,
        createdAt: new Date(),
      });

      thread.lastMessage = text;
      thread.lastMessageTime = new Date();
      await thread.save();

      return res.status(200).json({
        error: false,
        message: "Message sent successfully.",
        message,
      });
    } catch (error) {
      return res.status(500).json({ error: true, message: error.message });
    }
  },

  // id = thread ID
  async getMessages(req, res) {
    try {
      const thread = await ChatThread.findOne({ _id: req.params.id });

      if (thread === null)
        return res.status(400).json({ error: true, reason: "No Thread Found" });

      const read = [];
      const message = await ChatMessage.find({ _thread: thread._id });

      message.forEach((e) => {
        e.isRead = true;
        read.push(e.save());
      });
      await Promise.all(read);

      return res.json({ error: false });
    } catch (error) {
      return res.status(500).json({ error: true, message: error.message });
    }
  },

  // create chatThread
  async createChatThread(req, res) {
    const { userId } = req.params;
    const { id } = req.user;

    try {
      const admin = await User.findOne({ _id: id });
      if (!admin || admin.loginType !== "admin") {
        return res
          .status(403)
          .json({ error: true, message: "You are not an admin." });
      }

      const user = await User.findOne({ _id: userId });
      if (user === null) {
        return res
          .status(404)
          .json({ error: true, message: "User not found." });
      }

      const existingThread = await ChatThread.findOne({
        _participants: { $all: [admin._id, user._id] },
      });

      if (existingThread) {
        return res.status(200).json({
          error: false,
          message: "Chat thread already exists.",
          thread: existingThread,
        });
      }

      const thread = await ChatThread.create({
        _participants: [admin._id, user._id],
      });

      return res.status(201).json({
        error: false,
        message: "Chat thread created successfully.",
        thread,
      });
    } catch (error) {
      return res.status(500).json({ error: true, message: error.message });
    }
  },

  async getChatThread(req, res) {
    try {
      const { id } = req.params;
      const thread = await ChatThread.findOne({
        _id: id,
      });
      if (thread === null) {
        return res
          .status(400)
          .json({ error: true, reason: "Thread not found" });
      }

      return res.status(200).json({
        error: false,
        thread,
      });
    } catch (error) {
      return res.status(500).json({ error: true, message: error.message });
    }
  },
};
