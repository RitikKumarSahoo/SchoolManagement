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
  attcahments: {
    url:{
      type:String
    },
    fileName:{
      type:String
    }
  },
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