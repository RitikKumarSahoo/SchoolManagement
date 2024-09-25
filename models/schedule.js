const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
  _class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
  },

  _school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "School",
  },

  routine: {
    d1: {
      first: {
        subjectName: { type: String },
        startTime: { type: Date },
        endTime: { type: Date },
        _teacher: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
      second: {
        subjectName: { type: String },
        startTime: { type: Date },
        endTime: { type: Date },
        _teacher: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
      third: {
        subjectName: { type: String },
        startTime: { type: Date },
        endTime: { type: Date },
        _teacher: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
      fourth: {
        subjectName: { type: String },
        startTime: { type: Date },
        endTime: { type: Date },
        _teacher: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
      fifth: {
        subjectName: { type: String },
        startTime: { type: Date },
        endTime: { type: Date },
        _teacher: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
      sixth: {
        subjectName: { type: String },
        startTime: { type: Date },
        endTime: { type: Date },
        _teacher: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    },
    d2: {
      first: {
        subjectName: { type: String },
        startTime: { type: Date },
        endTime: { type: Date },
        _teacher: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
      second: {
        subjectName: { type: String },
        startTime: { type: Date },
        endTime: { type: Date },
        _teacher: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
      third: {
        subjectName: { type: String },
        startTime: { type: Date },
        endTime: { type: Date },
        _teacher: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
      fourth: {
        subjectName: { type: String },
        startTime: { type: Date },
        endTime: { type: Date },
        _teacher: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
      fifth: {
        subjectName: { type: String },
        startTime: { type: Date },
        endTime: { type: Date },
        _teacher: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
      sixth: {
        subjectName: { type: String },
        startTime: { type: Date },
        endTime: { type: Date },
        _teacher: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    },
    d3: {
      first: {
        subjectName: { type: String },
        startTime: { type: Date },
        endTime: { type: Date },
        _teacher: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
      second: {
        subjectName: { type: String },
        startTime: { type: Date },
        endTime: { type: Date },
        _teacher: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
      third: {
        subjectName: { type: String },
        startTime: { type: Date },
        endTime: { type: Date },
        _teacher: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
      fourth: {
        subjectName: { type: String },
        startTime: { type: Date },
        endTime: { type: Date },
        _teacher: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
      fifth: {
        subjectName: { type: String },
        startTime: { type: Date },
        endTime: { type: Date },
        _teacher: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
      sixth: {
        subjectName: { type: String },
        startTime: { type: Date },
        endTime: { type: Date },
        _teacher: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    },
    d4: {
      first: {
        subjectName: { type: String },
        startTime: { type: Date },
        endTime: { type: Date },
        _teacher: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
      second: {
        subjectName: { type: String },
        startTime: { type: Date },
        endTime: { type: Date },
        _teacher: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
      third: {
        subjectName: { type: String },
        startTime: { type: Date },
        endTime: { type: Date },
        _teacher: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
      fourth: {
        subjectName: { type: String },
        startTime: { type: Date },
        endTime: { type: Date },
        _teacher: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
      fifth: {
        subjectName: { type: String },
        startTime: { type: Date },
        endTime: { type: Date },
        _teacher: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
      sixth: {
        subjectName: { type: String },
        startTime: { type: Date },
        endTime: { type: Date },
        _teacher: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    },
    d5: {
      first: {
        subjectName: { type: String },
        startTime: { type: Date },
        endTime: { type: Date },
        _teacher: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
      second: {
        subjectName: { type: String },
        startTime: { type: Date },
        endTime: { type: Date },
        _teacher: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
      third: {
        subjectName: { type: String },
        startTime: { type: Date },
        endTime: { type: Date },
        _teacher: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
      fourth: {
        subjectName: { type: String },
        startTime: { type: Date },
        endTime: { type: Date },
        _teacher: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
      fifth: {
        subjectName: { type: String },
        startTime: { type: Date },
        endTime: { type: Date },
        _teacher: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
      sixth: {
        subjectName: { type: String },
        startTime: { type: Date },
        endTime: { type: Date },
        _teacher: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    },
    d6: {
      first: {
        subjectName: { type: String },
        startTime: { type: Date },
        endTime: { type: Date },
        _teacher: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
      second: {
        subjectName: { type: String },
        startTime: { type: Date },
        endTime: { type: Date },
        _teacher: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
      third: {
        subjectName: { type: String },
        startTime: { type: Date },
        endTime: { type: Date },
        _teacher: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
      fourth: {
        subjectName: { type: String },
        startTime: { type: Date },
        endTime: { type: Date },
        _teacher: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
      fifth: {
        subjectName: { type: String },
        startTime: { type: Date },
        endTime: { type: Date },
        _teacher: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
      sixth: {
        subjectName: { type: String },
        startTime: { type: Date },
        endTime: { type: Date },
        _teacher: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    },
  },

  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  date: {
    type: Date,
  },
});

module.exports = mongoose.model("Schedule", scheduleSchema);
