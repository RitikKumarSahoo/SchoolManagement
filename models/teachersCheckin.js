const mongoose = require("mongoose");

const teacherCheckInSchema = new mongoose.Schema({
  _school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "School",
  },

  teachers: [
    {
      _teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      time: {
        type: Date,
      },
      remark: {
        type: String,
      },
    },
  ],

  checkinDate: {
    type: Date,
  },
});

module.exports = mongoose.model("TeacherCheckIn", teacherCheckInSchema);
