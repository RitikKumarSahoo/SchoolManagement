const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema(
  {
    _school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
    },

    _teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    leaveType: {
      type: String,
      enum: ["PL", "SL", "CL"],
    },

    startDate: { type: Date },

    endDate: { type: Date },

    reason: { type: String },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "cancelled"],
      default: "pending",
    },

    appliedDate: { type: Date },

    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    isHalfDay: { type: Boolean },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Leave", leaveSchema);
