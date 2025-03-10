const User = require("../../models/user/index");
const Transaction = require("../../models/transaction");
const mail = require("../../lib/mail");
const moment = require("moment");
const Settings = require("../../models/settings")

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
      const user = await User.findOne({ _id: userId });
      if (user === null) {
        return res.status(400).json({ error: true, reason: "user not found" });
      }

      let transaction;
      if (user.loginType === "student") {
        transaction = await Transaction.create({
          _user: userId,
          amount: Number(amount),
          busFee: Number(busFee),
          totalAmount: amount + busFee,
          status,
          date: new Date(),
        });
      }
      if (user.loginType === "teacher") {
        transaction = await Transaction.create({
          _user: userId,
          amount: Number(amount),
          totalAmount: amount,
          status,
          date: new Date(),
        });
      }

      return res.status(201).json({ error: false, transaction });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: true, message: error.message });
    }
  },

  async Salary(req,res){
    try {
      const { teacherId , amount } = req.body
      const {_school} = req.user

      const settings = await settings.findOne({_school}).select("salary").exec()
      
      if(settings === null){
        return res.status(400).json({error:true , reason: "settings not found"})
      }

      const Teacher = await User.findOne({_school,_id:teacherId}).select("experience")
      if(Teacher === null){
        return res.status(400).json({error:true, reason:"Teacher not found"})
      }

      console.log(settings.salary);
      
      return res.status(200).json({error:false })
    } catch (error) {
      
    }
  },

  /**
 * @api {post} /admin/salary Pay salary to a teacher
 * @apiName PaySalary
 * @apiGroup Transaction
 * 
 * @apiParam {String} teacherId Teacher's unique ID.
 * @apiParam {Number} amount Salary amount to be paid to the teacher (optional, will use calculated amount based on experience if not provided).
 * 
 * @apiExample {json} Example Request:
 *    POST /admin/salary
 *    {
 *      "teacherId": "6738c4f008b861d9c1506848",
 *      "amount": 25000
 *    }
 * 
 * @apiExample {json} Example Response (Salary successfully paid):
 *    HTTP/1.1 200 OK
 *    {
 *      "error": false,
 *      "transaction": {
 *        "_id": "673aec22d0817c64a75a1b7c",
 *        "_teacher": "6738c4f008b861d9c1506848",
 *        "_school": "671a88862e586338c6c94516",
 *        "date": "2024-11-18T07:26:26.957Z",
 *        "amount": 25000,
 *        "status": "paid",
 *        "createdAt": "2024-11-18T07:26:26.957Z",
 *        "updatedAt": "2024-11-18T07:26:26.957Z"
 *      }
 *    }
 * 
 * @apiExample {json} Example Response (Salary already paid for the current month):
 *    HTTP/1.1 400 Bad Request
 *    {
 *      "error": true,
 *      "reason": "Salary already paid for November 2024"
 *    }
 */

  async Salary(req, res) {
    try {
      const { teacherId, amount } = req.body
      const { _school } = req.user

      if (req.user.loginType !== "admin") {
        return res.status(400).json({ error: true, reason: "You are not admin" })
      }

      const settings = await Settings.findOne({ _school }).select("salary").exec()

      if (settings === null) {
        return res.status(400).json({ error: true, reason: "settings not found" })
      }

      const Teacher = await User.findOne({ _school, _id: teacherId }).select("experience")
      if (Teacher === null) {
        return res.status(400).json({ error: true, reason: "Teacher not found" })
      }

      const teacherExperience = Number(Teacher.experience)
      if (!teacherExperience || teacherExperience <= 0) {
        return res.status(400).json({ error: true, reason: "Invalid experience value for the teacher" });
      }

      const salaryRange = settings.salary.find((rangeObj) => {

        const [min, max] = rangeObj.range.split("-").map(Number)
        return teacherExperience >= min && teacherExperience <= max
      });

      const startOfMonth = moment().startOf("month").toDate();
      const endOfMonth = moment().endOf("month").toDate();

      const existingPayment = await Transaction.findOne({
        _school,
        _user: teacherId,
        date: { $gte: startOfMonth, $lte: endOfMonth },
        status: "paid",
      })

      if (existingPayment) {
        return res.status(400).json({
          error: true,
          reason: `Salary already paid for ${moment(existingPayment.date).format("MMMM YYYY")}`,
        });
      }

      const transaction = await Transaction.create({
        amount: amount ? amount : salaryRange.amount,
        _teacher: Teacher._id,
        _school,
        date: new Date(),
        status: "paid",
      })
      return res.status(200).json({ error: false, transaction })
    } catch (error) {
      return res.status(500).json({ error: true, Error: error.message })
    }
  },

 /**
 * @api {get} /admin/transaction/get/:id Get a transaction by ID
 * @apiName GetTransaction
 * @apiGroup Transaction
 * 
 * @apiParam {String} id Transaction's unique ID.
 * 

 * 
 * @apiExample {json} Example Request:
 *    GET /admin/transaction/get/673aec22d0817c64a75a1b7c
 * 
 * @apiExample {json} Example Response (Transaction found):
 *    HTTP/1.1 200 OK
 *    {
 *      "error": false,
 *      "transaction": {
 *        "_id": "673aec22d0817c64a75a1b7c",
 *        "_teacher": "6738c4f008b861d9c1506848",
 *        "_school": "671a88862e586338c6c94516",
 *        "date": "2024-11-02T00:00:00.000Z",
 *        "amount": 18000,
 *        "status": "paid",
 *        "createdAt": "2024-11-18T07:26:26.957Z",
 *        "updatedAt": "2024-11-18T07:26:26.957Z"
 *      }
 *    }
 * 
 * @apiExample {json} Example Response (Transaction not found):
 *    HTTP/1.1 400 Bad Request
 *    {
 *      "error": true,
 *      "message": "Transaction not found"
 *    }
 */

  async get(req, res) {
    try {
      const { id } = req.params;
      const transaction = await Transaction.findOne({
        _id: id,
      })

      if (!transaction) {
        return res.status(400).json({
          error: true,
          message: "Transaction not found",
        });
      }

      return res.status(200).json({
        error: false,
        transaction,
      });
    } catch (error) {
      return res.status(500).json({
        error: true,
        message: error.message,
      });
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
   * @apiParam {String} transactionId The ID of the transaction to be updated.
   * @apiParam {String} [userId] The ID of the user associated with the transaction.
   * @apiParam {Number} [amount] The new transaction amount.
   * @apiParam {Number} [busFee] The new bus fee amount.
   * @apiParam {String="success","pending"} [status] The new status of the transaction.
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

  /**
 * @api {post} /user/transaction Get own transaction details
 * @apiName GetOwnTransactionDetails
 * @apiGroup Transaction
 * 
 * @apiParam {Number} [pageNumber=1] Page number for pagination (default is 1).
 * @apiParam {Number} [pageSize=10] Number of records per page (default is 10).
 * 
 * @apiExample {json} Example Request:
 *    {
 *      "pageNumber": 1,
 *      "pageSize": 10
 *    }
 *
 * @apiExample {json} Example Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "error": false,
 *      "transaction": [
 *        {
 *          "_id": "6083f9a1b413c24f4446d98b",
 *          "date": "2024-10-25",
 *          "amount": 5000,
 *          "busFee": 100,
 *          "totalAmount": 5100,
 *          "status": "success"
 *        }
 *      ],
 *      "totalTransaction": 50
 *    }
 */

  async ownTransactionDetails(req, res) {

    try {
      const { _id, _school } = req.user
      let { pageNumber = 1, pageSize = 10 } = req.body;
      if (isNaN(pageNumber) || pageNumber < 1 || isNaN(pageSize) || pageSize < 1) {
        return res
          .status(400)
          .json({ error: true, reason: "Invalid page number or page size" });
      }

      const skipNumber = (pageNumber - 1) * pageSize;

      const transaction = await Transaction.find({ _teacher: _id, _school })
        .sort({ createdAt: -1 })
        .skip(skipNumber)
        .limit(pageSize)
        .exec();

      const totalTransaction = await Transaction.countDocuments({ _teacher: _id, _school })

      return res.status(200).json({ error: false, transaction, totalTransaction })
    } catch (error) {
      return res.status(500).json({ error: true, Error: error.message })
    }
  },


  /**
 * @api {post} /admin/transactions Get all transactions for a school
 * @apiName GetAllTransactions
 * @apiGroup Transaction
 * 
 * @apiParam {Number} [pageNumber=1] Page number for pagination (default is 1).
 * @apiParam {Number} [pageSize=10] Number of records per page (default is 10).
 * @apiParam {String} setField Specify the field to filter transactions by. Can be:
 * - `"teacher"` to get transactions for teachers.
 * - `"student"` to get transactions for students.
 * - No value to get transactions for both teachers and students.
 * 
 * @apiError (400) {Boolean} error Indicates that the user is not an admin.
 * @apiError (500) {Boolean} error Indicates server error.
 * @apiError (500) {String} Error Error message detailing the issue.
 * 
 * @apiExample {json} Example Request (for teachers):
 *    POST /admin/transactions
 *    {
 *      "pageNumber": 1,
 *      "pageSize": 10,
 *      "setField": "teacher"
 *    }
 * 
 * @apiExample {json} Example Request (for students):
 *    POST /admin/transactions
 *    {
 *      "pageNumber": 1,
 *      "pageSize": 10,
 *      "setField": "student"
 *    }
 * 
 * @apiExample {json} Example Response (for teachers):
 *    HTTP/1.1 200 OK
 *    {
 *      "error": false,
 *      "transaction": [
 *        {
 *          "_id": "673aec22d0817c64a75a1b7c",
 *          "_teacher": "6738c4f008b861d9c1506848",
 *          "date": "2024-11-02T00:00:00.000Z",
 *          "amount": 18000,
 *          "status": "paid",
 *          "_school": "671a88862e586338c6c94516",
 *          "createdAt": "2024-11-18T07:26:26.957Z",
 *          "updatedAt": "2024-11-18T07:26:26.957Z",
 *          "userType": "teacher"
 *        }
 *      ]
 *    }
 * 
 * @apiExample {json} Example Response (for students):
 *    HTTP/1.1 200 OK
 *    {
 *      "error": false,
 *      "transaction": [
 *        {
 *          "_id": "673aec22d0817c64a75a1b7c",
 *          "_student": "6738c4f008b861d9c1506848",
 *          "date": "2024-11-02T00:00:00.000Z",
 *          "amount": 5000,
 *          "status": "paid",
 *          "_school": "671a88862e586338c6c94516",
 *          "createdAt": "2024-11-18T07:26:26.957Z",
 *          "updatedAt": "2024-11-18T07:26:26.957Z",
 *          "userType": "student"
 *        }
 *      ]
 *    }
 */

  async allTransaction(req, res) {
    try {
      const { _school, loginType } = req.user
      let { pageNumber = 1, pageSize = 10, setField } = req.body
      const skipNumber = (pageNumber - 1) * pageSize;

      if (loginType !== 'admin') {
        return res.status(400).json({ error: true, reason: "You are not admin" })
      }

      if (setField === "teacher") {
        const transaction = await Transaction.find({ _school, userType: "teacher" })
          .sort({ createdAt: -1 })
          .skip(skipNumber)
          .limit(pageSize)
          .exec();

        return res.status(200).json({ error: false, transaction })
      }

      if (setField === "student") {
        const transaction = await Transaction.find({ _school, userType: "student" })
          .sort({ createdAt: -1 })
          .skip(skipNumber)
          .limit(pageSize)
          .exec();
        return res.status(200).json({ error: false, transaction })
      }

      const transaction = await Transaction.find({ _school })
        .sort({ createdAt: -1 })
        .skip(skipNumber)
        .limit(pageSize)
        .exec();

      return res.status(200).json({ error: false, transaction })
    } catch (error) {
      return res.status(500).json({ error: true, Error: error.message })
    }
  }
};
