const mongoose = require("mongoose");

const NoticeSchema = new mongoose.Schema({
  _school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "School",
  },
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  noticeType: {
    type: String,
    enum: ["student", "teacher", "general"],
  },
  isUrgent: {
    type: Boolean,
    default: false,
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  expireDate: {
    type: Date,
  },
  attachments: [
    {
      createdAt: {
        type: Date,
        default: Date.now,
      },
      doctype: {
        type: String,
      },
      filename: {
        type: String,
      },
      url: {
        type: String,
      },
    },
  ],
  isActive:{
    type:Boolean,
    default:true
  },
  postedDate: {
    type: Date,
  },
  signatureOfTeacherUrl: {
    type: String, //signature image url of the person who posted the notice.
  },
});

module.exports = mongoose.model("Notice", NoticeSchema)