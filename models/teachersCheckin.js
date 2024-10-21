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

teacherCheckInSchema.index({ location: "2dsphere" });
teacherCheckInSchema.path("teachers").schema.set("_id", false);

module.exports = mongoose.model("TeacherCheckIn", teacherCheckInSchema);
