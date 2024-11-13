const mongoose = require("mongoose");

const progressReportSchema = new mongoose.Schema(
  {
    _school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
    },

    _user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    _class:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
    },

    academicYear: {
      type: String,
    },

    termType: {
      type: String,
      enum: ["midterm", "final"],
    },

    subjects: [
      {
        subject: {
          type: String,
        },
        marks: {
          type: Number,
        },
        examDate: {
          type: Date,
        },
      },
    ],

    totalMarks: {
      type: Number,
    },

    totalOutOf: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ProgressReport", progressReportSchema);
