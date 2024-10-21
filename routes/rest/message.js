const User = require("../../models/user");
const School = require("../../models/school");
const Class = require("../../models/class");
const Attendance = require("../../models/attendance");
const moment = require("moment");
const ChatThread = require("../../models/chatThread");
const ChatMessage = require("../../models/chatMessage");

module.exports = {
  /**
   *
   * @api {post} /message/permission MessagingPermission
   * @apiName MessagingPermission
   * @apiGroup Message
   *
   * @apiHeader {String} Authorization Bearer token for admin access.
   *
   * @apiParam {String} userId The ID of the user for whom messaging permission is being updated.
   * @apiParam {Boolean} enable Flag to enable or disable messaging for the user.
   *
   * @apiParamExample {json} Request-Example:
   * {
   *   "userId": "60c72b2f9b1e8a3b4c3e4f6e",
   *   "enable": true
   * }
   *
   * @apiSuccess {Boolean} error Indicates whether there was an error (false for success).
   * @apiSuccess {String} message Confirmation message about the update.
   * @apiSuccess {Object} user The updated user object.
   * @apiSuccess {String} user._id The unique ID of the user.
   * @apiSuccess {Boolean} user.messagingEnabled The messaging permission status for the user.
   *
   * @apiSuccessExample {json} Success-Response:
   * {
   *   "error": false,
   *   "message": "Messaging has been enabled for user 60c72b2f9b1e8a3b4c3e4f6e.",
   *   "user": {
   *     "_id": "60c72b2f9b1e8a3b4c3e4f6e",
   *     "messagingEnabled": true
   *   }
   * }
   *
   * @apiError (403) {Boolean} error Indicates whether there was an error (true).
   * @apiError (403) {String} message The reason for the error (e.g., "You are not an admin.").
   * @apiError (404) {Boolean} error Indicates whether there was an error (true).
   * @apiError (404) {String} message The reason for the error (e.g., "User not found.").
   *
   * @apiErrorExample {json} Error-Response:
   * {
   *   "error": true,
   *   "message": "User not found."
   * }
   *
   */
  async messagePermission(req, res) {
    const { userId, enable } = req.body;
    const { id } = req.user; //admin

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
  /**
   *
   * @api {post} /message/sendmessage Send Message
   * @apiName sendMessage
   * @apiGroup Message
   * @apiVersion 1.0.0
   * @apiPermission User
   *
   * @apiHeader {String} Authorization Bearer token for user access.
   *
   * @apiParam {String} text The content of the message to be sent.
   * @apiParam {String} _to The ID of the user to whom the message is being sent.
   *
   * @apiParamExample {json} Request-Example:
   * {
   *   "text": "Hello, how are you?",
   *   "_to": "60c72b2f9b1e8a3b4c3e4f6e"
   * }
   *
   * @apiSuccess (200) {String} messageDetails._from The ID of the sender.
   * @apiSuccess (200) {String} messageDetails._to The ID of the receiver.
   * @apiSuccess (200) {String} messageDetails.text The text content of the message.
   * @apiSuccess (200) {Date} messageDetails.createdAt The timestamp when the message was created.
   *
   * @apiSuccessExample {json} Success-Response:
   * {
   *   "error": false,
   *   "message": "Message sent successfully.",
   *   "messageDetails": {
   *     "_id": "60c72b2f9b1e8a3b4c3e4f6f",
   *     "_from": "60c72b2f9b1e8a3b4c3e4f6a",
   *     "_to": "60c72b2f9b1e8a3b4c3e4f6b",
   *     "text": "Hello, how are you?",
   *     "createdAt": "2024-10-04T12:00:00.000Z"
   *   }
   * }
   *
   * @apiError (404) {Boolean} error Indicates whether there was an error (true).
   * @apiError (404) {String} message Reason for the error (e.g., "Sender not found.", "Receiver not found.").
   *
   * @apiErrorExample {json} Error-Response:
   * {
   *   "error": true,
   *   "message": "Receiver not found."
   * }
   *
   */
  async sendMessage(req, res) {
    const { text, _to } = req.body;
    const { id } = req.user;

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

  /**
   *
   * @api {get} /message/readmessage/:id  Read Messages
   * @apiName ReadMessages
   * @apiGroup Message
   *
   * @apiHeader {String} Authorization Bearer token for user access.
   *
   * @apiParam {String} id The ID of the chat thread to read messages from.
   *
   *
   * @apiSuccessExample {json} Success-Response:
   * {
   *   "error": false,
   *   "messages": [
   *     {
   *       "_id": "60c72b2f9b1e8a3b4c3e4f6f",
   *       "_from": "60c72b2f9b1e8a3b4c3e4f6a",
   *       "_to": "60c72b2f9b1e8a3b4c3e4f6b",
   *       "text": "Hello!",
   *       "createdAt": "2024-10-01T10:00:00Z",
   *       "isRead": true
   *     },
   *     // More messages...
   *   ]
   * }
   *
   * @apiError (400) {Boolean} error Indicates whether there was an error (true).
   * @apiError (400) {String} reason The reason for the error (e.g., "No Thread Found").
   *
   * @apiErrorExample {json} Error-Response:
   * {
   *   "error": true,
   *   "reason": "No Thread Found"
   * }
   *
   */
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

      return res.json({ error: false, message });
    } catch (error) {
      return res.status(500).json({ error: true, message: error.message });
    }
  },

  /**
   *
   * @api {post} /message/createthread/:userId  Create ChatThread
   * @apiName CreateChatThread
   * @apiGroup Message
   *
   * @apiHeader {String} Authorization Bearer token for admin access.
   *
   * @apiParam {String} userId The ID of the user with whom the chat thread is being created.
   *
   * @apiSuccess {Boolean} error Indicates whether there was an error (false for success).
   * @apiSuccess {String} message Confirmation message about the creation of the chat thread.
   * @apiSuccess {Object} thread The created chat thread object.
   * @apiSuccess {String} thread._id The unique ID of the chat thread.
   * @apiSuccess {Array} thread._participants Array of participant IDs in the chat thread.
   *
   * @apiSuccessExample {json} Success-Response:
   * {
   *   "error": false,
   *   "message": "Chat thread created successfully.",
   *   "thread": {
   *     "_id": "60c72b2f9b1e8a3b4c3e4f6f",
   *     "_participants": [
   *       "60c72b2f9b1e8a3b4c3e4f6a",
   *       "60c72b2f9b1e8a3b4c3e4f6b"
   *     ]
   *   }
   * }
   *
   * @apiError (403) {Boolean} error Indicates whether there was an error (true).
   * @apiError (403) {String} message The reason for the error (e.g., "You are not an admin.").
   * @apiError (404) {Boolean} error Indicates whether there was an error (true).
   * @apiError (404) {String} message The reason for the error (e.g., "User not found.").
   *
   * @apiErrorExample {json} Error-Response:
   * {
   *   "error": true,
   *   "message": "User not found."
   * }
   *
   */
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

  /**
   *
   * @api {get} /message/thread/:id  Get ChatThread
   * @apiName GetChatThread
   * @apiGroup Message
   *
   * @apiParam {String} id The unique ID of the chat thread to be retrieved.
   *
   * @apiSuccess {Boolean} error Indicates whether there was an error (false for success).
   * @apiSuccess {Object} thread The retrieved chat thread object.
   * @apiSuccess {String} thread._id The unique ID of the chat thread.
   * @apiSuccess {Array} thread._participants Array of participant IDs in the chat thread.
   * @apiSuccess {Date} thread.createdAt The date when the chat thread was created.
   *
   * @apiSuccessExample {json} Success-Response:
   * {
   *   "error": false,
   *   "thread": {
   *     "_id": "60c72b2f9b1e8a3b4c3e4f6f",
   *     "_participants": [
   *       "60c72b2f9b1e8a3b4c3e4f6a",
   *       "60c72b2f9b1e8a3b4c3e4f6b"
   *     ],
   *     "createdAt": "2023-07-20T10:00:00Z"
   *   }
   * }
   *
   * @apiError (400) {Boolean} error Indicates whether there was an error (true).
   * @apiError (400) {String} reason The reason for the error (e.g., "Thread not found").
   *
   * @apiErrorExample {json} Error-Response:
   * {
   *   "error": true,
   *   "reason": "Thread not found"
   * }
   *
   */

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
