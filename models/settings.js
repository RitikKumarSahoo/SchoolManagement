const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema({
  availableClasses: [
    {
      grade: { type: String },
      section: [String],
      monthlyFee: { type: Number }, // student Fee
    },
  ],

  _school: { type: String },

  academicYear: { type: String },

  busFee: {
    type: Map,
    of: Number,
  },

  salaryRange: [
    {
      classRange: { type: String }, //"1-4", "5-7", "8-10"
      salary: { type: Number },
    },
  ],

  holidays: [
    {
      name: { type: String }, // Name of the holiday, e.g., "Diwali"
      date: { type: Date }, // Specific date of the holiday
    },
  ],

  date: { type: Date, default: Date.now() },

  isActive: { type: Boolean },
});

module.exports = mongoose.model("Setting", settingSchema);
