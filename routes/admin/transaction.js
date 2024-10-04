const User = require("../../models/user/index");
const Transaction = require("../../models/transaction");
const mail = require("../../lib/mail");
const moment = require("moment");

module.exports = {
  /**
   * @api {get} /transaction/pendingfee Get Pending Fee Payments
   * @apiName GetPendingPayments
   * @apiGroup Transaction
   *
   * @apiHeader {String} Authorization Bearer token for admin access.
   *
   * @apiSuccess {Object[]} studentsWithPendingPayments List of students with pending fees.
   * @apiSuccess {String} studentsWithPendingPayments.studentId ID of the student.
   * @apiSuccess {String[]} studentsWithPendingPayments.pendingMonths Months for which fees are pending.
   * @apiSuccess {String} studentsWithPendingPayments.studentEmail Email of the student.
   * @apiSuccess {Number} studentsWithPendingPayments.amountDue Total amount due.
   *
   * @apiSuccessExample {json} Success-Response:
   * {
   *   "error": false,
   *   "studentsWithPendingPayments": [
   *     {
   *       "studentId": "60d5f60c9b4d7635e8aebaf7",
   *       "pendingMonths": ["September", "October"],
   *       "studentEmail": "student@example.com",
   *       "amountDue": 150
   *     }
   *   ]
   * }
   *
   * @apiError AdminNotFound The user making the request is not an admin.
   * @apiErrorExample {json} Error-Response:
   * {
   *   "error": true,
   *   "reason": "admin not found"
   * }
   *
   * @apiError NoStudentsFound No students found in the school.
   * @apiErrorExample {json} Error-Response:
   * {
   *   "error": true,
   *   "message": "No students found"
   * }
   *
   * @apiError InternalServerError Internal server error during the fetching process.
   * @apiErrorExample {json} Error-Response:
   * {
   *   "error": true,
   *   "message": "Internal server error"
   * }
   */
  async pendingPayment(req, res) {
    try {
      // const { _school } = req.body;
      const { loginType, _school } = req.user;
      if (loginType !== "admin") {
        return res.status(400).json({ error: true, reason: "admin not found" });
      }

      // Fetch all students in the school
      const students = await User.find({
        loginType: "student",
        _school,
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
            return moment.unix(transaction.date / 1000).format("MMMM");
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
};
