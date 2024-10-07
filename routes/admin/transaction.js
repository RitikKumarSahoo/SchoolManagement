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
      });

      if (students.length === 0) {
        return res
          .status(400)
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
            totalAmount += transaction.totalAmount;
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
   * @apiHeader {String} Authorization Bearer token for admin access.
   *
   * @apiParam {String} userId The ID of the user creating the transaction.
   * @apiParam {Number} amount The amount for the transaction.
   * @apiParam {Number} busFee The bus fee associated with the transaction.
   * @apiParam {String="success","pending"} [status] The new status of the transaction.
   *
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
    const { userId, amount, busFee, status } = req.body;
    const { loginType } = req.user;

    try {
      if (loginType !== "admin") {
        return res
          .status(400)
          .json({ error: true, reason: "you are not admin" });
      }
      const transaction = await Transaction.create({
        _user: userId,
        amount: Number(amount),
        busFee: Number(busFee),
        totalAmount: amount + busFee,
        status,
        date: new Date(),
      });

      return res.status(201).json({ error: false, transaction });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: true, message: error.message });
    }
  },

  /**
   * @api {put} //transaction/update Update Transaction
   * @apiName UpdateTransaction
   * @apiGroup Transaction
   * @apiPermission Admin
   *
   * @apiDescription This endpoint allows an admin to update an existing transaction's details such as the amount, bus fee, and status.
   *
   * @apiHeader {String} Authorization Bearer token (Admin's token)
   *
   * @apiBody {String} transactionId The ID of the transaction to be updated.
   * @apiBody {String} [userId] The ID of the user associated with the transaction.
   * @apiBody {Number} [amount] The new transaction amount.
   * @apiBody {Number} [busFee] The new bus fee amount.
   * @apiBody {String="success","pending"} [status] The new status of the transaction.
   *
   * @apiSuccess {Boolean} error Indicates whether the operation was successful or not.
   * @apiSuccess {String} message Success message.
   * @apiSuccess {Object} transaction The updated transaction object.
   *
   * @apiSuccessExample {json} Success-Response:
   *  HTTP/1.1 200 OK
   *  {
   *    "error": false,
   *    "message": "Transaction updated successfully",
   *    "transaction": {
   *      "_id": "652def8a7a39a61056fb8654",
   *      "_user": "652dc8b95a36b92434b54e88",
   *      "amount": 1000,
   *      "busFee": 50,
   *      "totalAmount": 1050,
   *      "status": "pending",
   *      "date": "2024-10-01T10:00:00.000Z"
   *    }
   *  }
   *
   * @apiError (400) {Boolean} error Indicates that there was an error.
   * @apiError (400) {String} reason The reason for the error.
   *
   * @apiErrorExample {json} Error-Response:
   *  HTTP/1.1 400 Bad Request
   *  {
   *    "error": true,
   *    "reason": "Invalid transaction data provided."
   *  }
   *
   * @apiErrorExample {json} Error-Response:
   *  HTTP/1.1 403 Forbidden
   *  {
   *    "error": true,
   *    "reason": "You are not authorized to update this transaction."
   *  }
   *
   * @apiErrorExample {json} Error-Response:
   *  HTTP/1.1 404 Not Found
   *  {
   *    "error": true,
   *    "reason": "Transaction not found."
   *  }
   */

  async updateTransaction(req, res) {
    const { transactionId, userId, amount, busFee, status } = req.body;
    const { loginType } = req.user;

    try {
      if (transactionId === undefined) {
        return res
          .status(400)
          .json({ error: true, reason: "transactionId is required" });
      }
      if (loginType !== "admin") {
        return res.status(403).json({
          error: true,
          reason: "You are not authorized to update this transaction.",
        });
      }

      const transaction = await Transaction.findOne({ _id: transactionId });

      if (transaction === null) {
        return res
          .status(404)
          .json({ error: true, reason: "Transaction not found." });
      }

      if (userId) transaction._user = userId;
      if (amount) transaction.amount = Number(amount);
      if (busFee) transaction.busFee = Number(busFee);
      if (amount && busFee)
        transaction.totalAmount = Number(amount) + Number(busFee);
      if (status) transaction.status = status;

      await transaction.save();

      return res.status(200).json({
        error: false,
        message: "Transaction updated successfully",
        transaction,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: true, message: error.message });
    }
  },
};
