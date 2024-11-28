const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
  _school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "School", // Reference to the School schema
  },
  _class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class", // Reference to the Class schema
  },
  weekSchedule: {
    mon: [
      {
        periodType: {
          type: String, // "period" or "break"
        },
        startTime: {
          type: String, // Format: "HH:mm"
        },
        endTime: {
          type: String, // Format: "HH:mm"
        },
        subject: {
          type: String, // e.g., "Math", "Science"
        },
        _teacher: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User", // Reference to User schema, since Teacher is now from User
        },
      },
    ],
    tue: [
      {
        periodType: {
          type: String, // "period" or "break"
        },
        startTime: {
          type: String, // Format: "HH:mm"
        },
        endTime: {
          type: String, // Format: "HH:mm"
        },
        subject: {
          type: String, // e.g., "Math", "Science"
        },
        _teacher: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User", // Reference to User schema
        },
      },
    ],
    wed: [
      {
        periodType: {
          type: String, // "period" or "break"
        },
        startTime: {
          type: String, // Format: "HH:mm"
        },
        endTime: {
          type: String, // Format: "HH:mm"
        },
        subject: {
          type: String, // e.g., "Math", "Science"
        },
        _teacher: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User", // Reference to User schema
        },
      },
    ],
    thu: [
      {
        periodType: {
          type: String, // "period" or "break"
        },
        startTime: {
          type: String, // Format: "HH:mm"
        },
        endTime: {
          type: String, // Format: "HH:mm"
        },
        subject: {
          type: String, // e.g., "Math", "Science"
        },
        _teacher: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User", // Reference to User schema
        },
      },
    ],
    fri: [
      {
        periodType: {
          type: String, // "period" or "break"
        },
        startTime: {
          type: String, // Format: "HH:mm"
        },
        endTime: {
          type: String, // Format: "HH:mm"
        },
        subject: {
          type: String, // e.g., "Math", "Science"
        },
        _teacher: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User", // Reference to User schema
        },
      },
    ],
    sat: [
      {
        periodType: {
          type: String, // "period" or "break"
        },
        startTime: {
          type: String, // Format: "HH:mm"
        },
        endTime: {
          type: String, // Format: "HH:mm"
        },
        subject: {
          type: String, // e.g., "Math", "Science"
        },
        _teacher: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User", // Reference to User schema
        },
      },
    ],
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to User schema (for admin/creator of the schedule)
  },
});

scheduleSchema.set("timestamps", true); // Automatically adds createdAt and updatedAt fields

module.exports = mongoose.model("Schedule", scheduleSchema);
