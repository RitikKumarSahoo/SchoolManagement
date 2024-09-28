const User = require("../../models/user/index");
const Transaction = require("../../models/transaction");
const mail = require("../../lib/mail");
const moment = require("moment");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_AUTH_USER,
    pass: process.env.SMTP_AUTH_PASSWORD,
  },
});

module.exports = {
  // pending payment fees
  async pendingPayment(req, res) {
    try {
      // const { _school } = req.body;

      // Fetch all students in the school
      const students = await User.find({
        loginType: "student",
      }).exec();

      if (students.length === 0) {
        return res
          .status(404)
          .json({ error: true, message: "No students found" });
      }

      const studentsWithPendingPayments = [];

      for (const student of students) {
        let totalAmount = 0;
        const pendingTransactions = await Transaction.find({
          _user: student._id,
          status: "pending",
        });

        if (pendingTransactions.length > 0) {
          const pendingMonths = pendingTransactions.map((transaction) => {
            totalAmount += transaction.amount;
            return moment(transaction.date).format("MMMM");
          });

          studentsWithPendingPayments.push({
            studentId: student._id,
            pendingMonths,
            studentEmail: student.email,
            amountDue: totalAmount,
          });

          await mail("pending-fees", {
            to: student.email,
            subject: "Pending Fee Reminder",
            locals: {
              studentName: student.firstName,
              pendingMonths,
              totalAmount,
            },
          });
        }
      }

      return res.status(200).json({
        error: false,
        studentsWithPendingPayments,
      });
    } catch (error) {
      return res.status(500).json({ error: true, message: error.message });
    }
  },

  // student transaction
  async studentTransaction(req, res) {
    try {
      const newTransaction = await Transaction.create(req.body);

      res.status(201).json({
        error: false,
        transaction: newTransaction,
      });
    } catch (error) {
      console.log(error.message);

      res.status(400).json({
        message: "Error creating transaction",
        error: error.message,
      });
    }
  },
};
