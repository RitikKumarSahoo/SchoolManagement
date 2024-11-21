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

  busFee: [
   { range: { type: String },
    fee: { type: Number },
  }
  ],

  salary: [
    {
      range: { type: String },
      amount: { type: Number },
    },
  ],

  holidays: [
    {
      name: { type: String }, // Name of the holiday, e.g., "Diwali"
      date: { type: String }, // Specific date of the holiday
    },
  ],

  leave: [
    {
      type:{ type:String , enum:["PL","CL","SL"] },
      days:{ type: Number, min:0 }
    }
  ],

  date: { type: Date, default: Date.now() },

  isActive: { type: Boolean },

  weekSchedule:{
    mon: {
      type: [
        {
          periodType: { type: String, required: true, enum: ['period', 'break'] }, // 'period' or 'break'
          startTime: { type: String, required: true }, // Format: HH:mm
          endTime: { type: String, required: true }, // Format: HH:mm
        },
      ],
      required: false, // Mark as optional
    },
    tue: {
      type: [
        {
          periodType: { type: String, required: true, enum: ['period', 'break'] },
          startTime: { type: String, required: true },
          endTime: { type: String, required: true },
        },
      ],
      required: false,
    },
    wed: {
      type: [
        {
          periodType: { type: String, required: true, enum: ['period', 'break'] },
          startTime: { type: String, required: true },
          endTime: { type: String, required: true },
        },
      ],
      required: false,
    },
    thu: {
      type: [
        {
          periodType: { type: String, required: true, enum: ['period', 'break'] },
          startTime: { type: String, required: true },
          endTime: { type: String, required: true },
        },
      ],
      required: false,
    },
    fri: {
      type: [
        {
          periodType: { type: String, required: true, enum: ['period', 'break'] },
          startTime: { type: String, required: true },
          endTime: { type: String, required: true },
        },
      ],
      required: false,
    },
    sat: {
      type: [
        {
          periodType: { type: String, required: true, enum: ['period', 'break'] },
          startTime: { type: String, required: true },
          endTime: { type: String, required: true },
        },
      ],
      required: false,
    }
  },
  schoolSubjectsList: [String]
  
});

module.exports = mongoose.model("Setting", settingSchema);
