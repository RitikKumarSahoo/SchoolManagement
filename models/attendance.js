const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const attendanceSchema = new mongoose.Schema({
  _school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  _class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
  },
  _teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  presentIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  date: {
    type: Date,
  },
  comment: {
    type: String,
  },
});

module.exports = mongoose.model("Attendance", attendanceSchema);
