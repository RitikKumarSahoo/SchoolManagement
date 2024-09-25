const mongoose = require("mongoose");

const TrnsactionSchema = new mongoose.schema({
  _school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "School",
  },
  _user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  userType: {
    type: String,
    enum: ["student", "teacher"],
  },
  paymentMonth: {
    type: String
  },
  totalAmount: {
    type: Number
  },
  busFee: {
    type: String
  },
  paymentHistory: {
    paymentDate: {
      type: Date
    },
    finalAmount: {
      type: Number
    },
    paymentMethod:{
      type: String
    }
  }

})

module.exports = mongoose.model("Transaction", TrnsactionSchema)