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
  totalTeachers: {
    type: Number,
  },
  totalClasses: {
    type: Number,
  },
  imageUrl: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  }, // Comment
  stripeAccountId: {
    type: String,
  },
});

SchoolSchema.index({ location: "2dsphere" });
module.exports = mongoose.model("School", SchoolSchema);
