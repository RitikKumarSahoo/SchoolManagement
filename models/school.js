const mongoose = require("mongoose");

const SchoolSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  registrationNumber: {
    type: String,
  },
  address: {
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    country: {
      type: String,
    },
    pinCode: {
      type: String,
    },
  },
  contact: {
    phoneNo: {
      type: String,
    },
    email: {
      type: String,
    },
    website: {
      type: String,
    },
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number],
      index: "2dsphere",
    },
  },
  principalName: {
    type: String,
  },
  establishYear: {
    type: Number,
  },
  schoolType: {
    type: String,
    enum: ["primary", "secondary", "highSchool"],
  },
  totalStudents: {
    type: Number,
  },
  totalClasses: {
    type: Number,
  },
  isActive: {
    type: Boolean,
    default: true,
  }, // Comment
});

module.exports = mongoose.model("School", SchoolSchema);
