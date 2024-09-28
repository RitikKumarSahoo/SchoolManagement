const mongoose = require("mongoose");

const ClassSchema = new mongoose.schema({
  _school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "School",
  },
  name: {
    type: String,
  },
  section: {
    type: String,
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
  },
  tillNowAttend: {
    type: Number,
  },
});

module.exports = mongoose.model("Class", ClassSchema);
