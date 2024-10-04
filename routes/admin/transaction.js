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

  /**
   * @api {post} /transaction/create Create Transaction
   * @apiName CreateTransaction
   * @apiGroup Transaction
   *
   * @apiParam {String} userId The ID of the user creating the transaction.
   * @apiParam {Number} amount The amount for the transaction.
   * @apiParam {Number} busFee The bus fee associated with the transaction.
   *
   * @apiSuccess {Boolean} error Indicates if there was an error.
   * @apiSuccess {Object} transaction The transaction object that was created.
   * @apiSuccess {String} transaction._id The unique ID of the transaction.
   * @apiSuccess {String} transaction._user The ID of the user associated with the transaction.
   * @apiSuccess {Number} transaction.amount The amount for the transaction.
   * @apiSuccess {Number} transaction.busFee The bus fee associated with the transaction.
   * @apiSuccess {Number} transaction.totalAmount The total amount of the transaction (amount + busFee).
   * @apiSuccess {String} transaction.status The status of the transaction.
   * @apiSuccess {Date} transaction.date The date of the transaction creation.
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 201 Created
   *     {
   *       "error": false,
   *       "transaction": {
   *         "_id": "609c2e08f74b612b6c345c44",
   *         "_user": "609c2e08f74b612b6c345c40",
   *         "amount": 100,
   *         "busFee": 10,
   *         "totalAmount": 110,
   *         "status": "pending",
   *         "date": "2024-10-01T10:00:00.000Z"
   *       }
   *     }
   *
   * @apiError InternalServerError There was an error creating the transaction.
   *
   * @apiErrorExample Error-Response:
   *     HTTP/1.1 500 Internal Server Error
   *     {
   *       "error": true,
   *       "message": "Error message here"
   *     }
   */
  async createTransaction(req, res) {
    const { userId, amount, busFee } = req.body;

    try {
      const transaction = await Transaction.create({
        _user: userId,
        amount: amount,
        busFee: busFee,
        totalAmount: amount + busFee,
        status: "pending",
        date: new Date(),
      });

      return res.status(201).json({ error: false, transaction });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: true, message: error.message });
    }
  },
};
