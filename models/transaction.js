const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  _teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  _student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  userType:{
    type:String,
    enum:["student","teacher"]
  },

  date: {
    type: Date,
    default: Date.now(),
  },
  amount: {
    type: Number,
  },
  busFee: {
    type: Number,
  },
  totalAmount: {
    type: Number,
  },
  status: {
    type: String,
    enum: ["pending", "paid"],
  },

  _school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School'
  }
},
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", TransactionSchema);
