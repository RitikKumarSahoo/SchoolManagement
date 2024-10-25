const mongoose = require("mongoose");

const ClassSchema = new mongoose.Schema({
  _school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "School",
  },
  name: {
    type: String,
  },
  section: {
    type: String,
    enum: ["A", "B", "C", "D", "E", "F"],
  },
  academicYear: {
    type: String,
  },

  _schedule: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Schedule",
  },
  totalClassTill: {
    type: Number,
    default: 0,
  },
  tillNowAttend: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Class", ClassSchema);
