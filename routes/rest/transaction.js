const User = require("../../models/user/index");
const Transaction = require("../../models/transaction");
const mail = require("../../lib/mail");

module.exports = {
  async pendingPayment(req, res) {
    try {
      const { _school } = req.body;

      // all students
      const students = User.find({ _school, loginType: "student" }).exec();
      if (students.length === 0) {
        return res
          .status(404)
          .json({ error: true, message: "No students found" });
      }

      //pending fees
      const studentsWithPendingPayments = [];
      for (const student of students) {
        const pendingTransactions = await Transaction.find({
          _user: student._id,
          status: "pending",
        }).exec();

        //extract months of a student
        if (pendingTransactions.length > 0) {
          const pendingMonths = pendingTransactions.map(
            (transaction) => transaction.paymentMonth
          );

          studentsWithPendingPayments.push({
            studentId: student._id,
            pendingMonths,
            studentemail: student.email,
          });
        }
      }

      return res.status(200).json({
        error: false,
        studentsWithPendingPayments,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ error: true, message: "Internal server error." });
    }
  },
};
