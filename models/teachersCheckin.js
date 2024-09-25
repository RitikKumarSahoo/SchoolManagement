const mongoose = require("mongoose");

const teacherCheckInSchema = new mongoose.Schema(
  {
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

    _school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("TeacherCheckIn", teacherCheckInSchema);
