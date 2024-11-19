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

  weekSchedule: {
    mon: [
      {
        periodType: { type: String, required: true, enum: ['period', 'break'] }, // either 'period' or 'break'
        startTime: { type: String, required: true },
        endTime: { type: String, required: true }
      }
    ],
    tue: [
      {
        periodType: { type: String, required: true, enum: ['period', 'break'] },
        startTime: { type: String, required: true },
        endTime: { type: String, required: true }
      }
    ],
    wed: [
      {
        periodType: { type: String, required: true, enum: ['period', 'break'] },
        startTime: { type: String, required: true },
        endTime: { type: String, required: true }
      }
    ],
    thu: [
      {
        periodType: { type: String, required: true, enum: ['period', 'break'] },
        startTime: { type: String, required: true },
        endTime: { type: String, required: true }
      }
    ],
    fri: [
      {
        periodType: { type: String, required: true, enum: ['period', 'break'] },
        startTime: { type: String, required: true },
        endTime: { type: String, required: true }
      }
    ],
    sat: [
      {
        periodType: { type: String, required: true, enum: ['period', 'break'] },
        startTime: { type: String, required: true },
        endTime: { type: String, required: true }
      }
    ]
  },
});

module.exports = mongoose.model("Setting", settingSchema);
