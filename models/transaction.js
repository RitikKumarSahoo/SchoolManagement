const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  _user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
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
    enum: ["success", "pending"],
  },
  
  _school:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School'
  }
});

module.exports = mongoose.model("Transaction", TransactionSchema);
