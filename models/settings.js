const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema({
  availableClasses: [
    {
      grade: { type: String },
      sections: [String],
      monthlyFee: { type: Number }, // student Fee
    },
  ],

  _school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "School",
  },

  academicYear: { type: String },

  busFee: {
    range:{type:String},
    fee: {type:Number},
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

  weekSchedule: {
    mon: { 
      type: Map, 
      of: new mongoose.Schema({
        startTime: { type: String },
        endTime: { type: String },
      }, { _id: false })
    },
    tue: { 
      type: Map, 
      of: new mongoose.Schema({
        startTime: { type: String },
        endTime: { type: String },
      }, { _id: false })
    },
    wed: { 
      type: Map, 
      of: new mongoose.Schema({
        startTime: { type: String },
        endTime: { type: String },
      }, { _id: false })
    },
    thu: { 
      type: Map, 
      of: new mongoose.Schema({
        startTime: { type: String },
        endTime: { type: String },
      }, { _id: false })
    },
    fri: { 
      type: Map, 
      of: new mongoose.Schema({
        startTime: { type: String },
        endTime: { type: String },
      }, { _id: false })
    },
    sat: { 
      type: Map, 
      of: new mongoose.Schema({
        startTime: { type: String },
        endTime: { type: String },
      }, { _id: false })
    },
  },
});

module.exports = mongoose.model("Setting", settingSchema);
