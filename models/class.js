const mongoose = require("mongoose");

const ClassSchema = new mongoose.Schema({ // Corrected casing here
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
  totalStudents: {
    type: Number,
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
