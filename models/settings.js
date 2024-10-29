const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema({
  availableClasses: [
    {
      grade: { type: String },
      section: [String],
      monthlyFee: { type: Number },
    },
  ],

  _school: { type: String },

  academicYear: { type: String },

  busFee: {
    type: Map,
    of: Number,
  },

  date: { type: Date, default: Date.now() },

  isActive: { type: Boolean },
});

module.exports = mongoose.model("Setting", settingSchema);
