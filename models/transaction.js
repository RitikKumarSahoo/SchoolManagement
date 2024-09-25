const mongoose = require("mongoose");

const TrnsactionSchema = new mongoose.schema({
  // _school: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "School",
  // },
  _user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  month: {
    type: String,
  },
  amount: {
    type: Number,
  },
  busFee: {
    type: String,
  },
  paymentHistory: {
    paymentDate: {
      type: Date,
    },
    finalAmount: {
      type: Number,
    },
    paymentMethod: {
      type: String,
    },
    status: {
      type: String,
      enum: ["success", "pending"],
    },
  },
});

module.exports = mongoose.model("Transaction", TrnsactionSchema);
