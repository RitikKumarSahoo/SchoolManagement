const User = require("../../models/user");
const School = require("../../models/school");
const randomstring = require("randomstring");
const mail = require("../../lib/mail");
const moment = require("moment");
const stripe = require("stripe")(
  "sk_test_51Pt2xx1xyS6eHcGHSrfLdSfyQQESKMatwXTA28TYmUMCXpnI2zjv1auMtdIZSyV771lqArWjZlXzFXE9yt87mbdS00ypiNeR0x"
);

module.exports = {
  /**
   * @api {get} /teachers Get All Teachers
   * @apiName GetAllTeachers
   * @apiGroup Teacher
   * @apiVersion 1.0.0
   * @apiDescription Retrieves all teachers belonging to the school
   *
   * @apiHeader {String} Authorization Bearer token for authentication.
   * @apiSuccessExample Success Response:
   *  HTTP/1.1 200 OK
   *  {
   *    "error": false,
   *    "message": "Teachers retrieved successfully.",
   *    "data": [
   *      {
   *        "_id": "614d1b6f8f8b9e001cb12345",
   *        "firstName": "John",
   *        "lastName": "Doe",
   *        "email": "john.doe@example.com",
   *        "phone": "1234567890",
   *        "gender": "Male",
   *        "_school": "614c1b6f8f8b9e001cb12345",
   *        "isActive": true
   *      },
   *      {
   *        "_id": "614d1b6f8f8b9e001cb12346",
   *        "firstName": "Jane",
   *        "lastName": "Smith",
   *        "email": "jane.smith@example.com",
   *        "phone": "0987654321",
   *        "gender": "Female",
   *        "_school": "614c1b6f8f8b9e001cb12345",
   *        "isActive": true
   *      }
   *    ]
   *  }
   *
   * @apiError {Boolean} error Indicates if there was an error (true if failed).
   * @apiError {String} message Error message explaining the reason.
   *
   * @apiErrorExample Error Response (No Teachers Found):
   *  HTTP/1.1 404 Not Found
   *  {
   *    "error": true,
   *    "message": "No teachers found for this school."
   *  }
   *
   * @apiErrorExample Error Response (Server Error):
   *  HTTP/1.1 500 Internal Server Error
   *  {
   *    "error": true,
   *    "reason": "Server error message."
   *  }
   */

  async getAllTeachers(req, res) {
    try {
      const { _school } = req.user;
      const teachers = await User.find({
        loginType: "teacher",
        _school: _school,
      }).select("-password -bankDetails");

      if (teachers.length === 0) {
        return res.status(404).json({
          error: true,
          message: "No teachers found for this school.",
        });
      }

      return res.status(200).json({
        error: false,
        message: "Teachers retrieved successfully.",
        data: teachers,
      });
    } catch (error) {
      return res.status(500).json({
        error: true,
        reason: error.message,
      });
    }
  },

  /**
   * @api {get} /teacher/find Find Teachers
   * @apiName FindTeachers
   * @apiGroup Teacher
   *
   * @apiHeader {String} Authorization Bearer token for admin access.
   *
   * @apiParam {String} searchText Optional search text to filter teachers by first name, last name, email, or phone.
   *
   * @apiSuccess {Boolean} error Indicates whether there was an error (false).
   * @apiSuccess {Object[]} users List of teachers matching the search criteria.
   * @apiSuccess {Number} usersCount Total number of teachers matching the search criteria.
   *
   * @apiSuccessExample {json} Success-Response:
   * {
   *   "error": false,
   *   "users": [
   *     {
   *       "_id": "60d5f60c9b4d7635e8aebaf7",
   *       "firstName": "John",
   *       "lastName": "Doe",
   *       "email": "john.doe@example.com",
   *       "phone": "1234567890",
   *       "isActive": true,
   *       "loginType": "teacher"
   *     }
   *   ],
   *   "usersCount": 1
   * }
   *
   * @apiError NotAdmin You are not an admin.
   * @apiErrorExample {json} Error-Response:
   * {
   *   "error": true,
   *   "reason": "You are not Admin"
   * }
   *
   * @apiError NoTeachersFound No teachers found matching the search criteria.
   * @apiErrorExample {json} Error-Response:
   * {
   *   "error": true,
   *   "reason": "No teacher found"
   * }
   *
   * @apiError InternalServerError Internal server error.
   * @apiErrorExample {json} Error-Response:
   * {
   *   "error": true,
   *   "reason": "Internal server error"
   * }
   */
  async find(req, res) {
    try {
      const { isAdmin } = req.user;
      const { searchText } = req.body;
      if (!isAdmin) {
        return res
          .status(400)
          .json({ error: true, reason: "You are not Admin" });
      }

      const query = {
        loginType: "teacher",
        isActive: true,
      };

      // text search
      if (searchText !== undefined) {
        const newSearch = searchText.trim();

        const searchRegex = new RegExp(newSearch, "i");
        query.$or = [
          { firstName: { $regex: searchRegex } },
          { lastName: { $regex: searchRegex } },
          { email: { $regex: searchRegex } },
          { phone: { $regex: searchRegex } },
        ];
      }

      const users = await User.find(query);
      if (users.length === 0) {
        return res
          .status(400)
          .json({ error: true, reason: "No teacher found" });
      }
      const usersCount = await User.countDocuments(query).exec();

      return res.status(200).json({ error: false, users, usersCount });
    } catch (error) {
      return res.status(400).json({ error: true, reason: error });
    }
  },

  /**
   * @api {get} /teacher/get/:id Get Teacher Details
   * @apiName GetTeacherDetails
   * @apiGroup Teacher
   *
   * @apiHeader {String} Authorization Bearer token for admin access.
   *
   * @apiParam {String} id Teacher's unique ID.
   *
   * @apiSuccess {Boolean} error Indicates whether there was an error (false).
   * @apiSuccess {Object} user Details of the teacher.
   * @apiSuccess {String} user._id Teacher's unique ID.
   * @apiSuccess {String} user.firstName Teacher's first name.
   * @apiSuccess {String} user.lastName Teacher's last name.
   * @apiSuccess {String} user.gender Teacher's gender.
   * @apiSuccess {String} user.email Teacher's email.
   * @apiSuccess {String} user.phone Teacher's phone number.
   * @apiSuccess {Date} user.dob Teacher's date of birth.
   * @apiSuccess {Boolean} user.isActive Indicates if the teacher is active.
   *
   * @apiSuccessExample {json} Success-Response:
   * {
   *   "error": false,
   *   "user": {
   *     "_id": "60d5f60c9b4d7635e8aebaf7",
   *     "firstName": "John",
   *     "lastName": "Doe",
   *     "gender": "Male",
   *     "email": "john.doe@example.com",
   *     "phone": "1234567890",
   *     "dob": "1985-04-15T00:00:00.000Z",
   *     "isActive": true
   *   }
   * }
   *
   * @apiError NotAdmin You are not an admin.
   * @apiErrorExample {json} Error-Response:
   * {
   *   "error": true,
   *   "reason": "You are not Admin"
   * }
   *
   * @apiError NoTeacherFound No teacher found with the given ID.
   * @apiErrorExample {json} Error-Response:
   * {
   *   "error": true,
   *   "reason": "No teacher found"
   * }
   *
   * @apiError InternalServerError Internal server error.
   * @apiErrorExample {json} Error-Response:
   * {
   *   "error": true,
   *   "reason": "Internal server error"
   * }
   */
  async get(req, res) {
    try {
      const { isAdmin } = req.user;
      if (!isAdmin) {
        return res
          .status(400)
          .json({ error: true, reason: "You are not Admin" });
      }

      const user = await User.findOne({
        loginType: "teacher",
        isActive: true,
        _id: req.params.id,
      });
      if (user === null) {
        return res
          .status(400)
          .json({ error: true, reason: "No teacher found" });
      }

      return res.status(200).json({ error: false, user });
    } catch (error) {
      return res.status(400).json({ error: true, reason: error });
    }
  },

  /**
   * @api {post} /teacher/create Create Teacher
   * @apiName CreateTeacher
   * @apiGroup Teacher
   *
   * @apiHeader {String} Authorization Bearer token for admin access.
   *
   * @apiParam {String} firstName First name of the teacher.
   * @apiParam {String} lastName Last name of the teacher.
   * @apiParam {String} gender Gender of the teacher (e.g., Male, Female).
   * @apiParam {String} email Email of the teacher (must be unique).
   * @apiParam {String} phone Phone number of the teacher (must be unique).
   * @apiParam {String} dob Date of birth of the teacher in DD/MM/YYYY format.
   * @apiParam {String} [signature] Optional signature of the teacher.
   * @apiParam {Object} [bankDetails] Optional bank details of the teacher.
   * @apiParam {String} [address] address of the teacher
   *
   * @apiSuccess {Boolean} error Indicates whether there was an error (false).
   * @apiSuccess {Object} user The newly created teacher object.
   *
   * @apiSuccessExample {json} Success-Response:
   * {
   *   "error": false,
   *   "user": {
   *     "_id": "60d5f60c9b4d7635e8aebaf7",
   *     "firstName": "John",
   *     "lastName": "Doe",
   *     "gender": "Male",
   *     "email": "john.doe@example.com",
   *     "phone": "1234567890",
   *     "dob": "1990-01-01T00:00:00.000Z",
   *     "username": "Joh1230",
   *     "isActive": true,
   *     "customerStripeId": "cus_123456789"
   *   }
   * }
   *
   * @apiError NotAdmin You are not an admin.
   * @apiErrorExample {json} Error-Response:
   * {
   *   "error": true,
   *   "reason": "You are not Admin"
   * }
   *
   * @apiError MissingField One or more required fields are missing.
   * @apiErrorExample {json} Error-Response:
   * {
   *   "error": true,
   *   "message": "First name is required"
   * }
   *
   * @apiError InvalidDOB Invalid date of birth format.
   * @apiErrorExample {json} Error-Response:
   * {
   *   "error": true,
   *   "message": "Invalid date of birth format. Use DD/MM/YYYY."
   * }
   *
   * @apiError EmailExists Email already in use.
   * @apiErrorExample {json} Error-Response:
   * {
   *   "error": true,
   *   "message": "Email already use, please provide an unique email"
   * }
   *
   * @apiError PhoneExists Phone number already in use.
   * @apiErrorExample {json} Error-Response:
   * {
   *   "error": true,
   *   "message": "Phone number already use, please provide an unique phone number"
   * }
   *
   * @apiError InternalServerError Internal server error.
   * @apiErrorExample {json} Error-Response:
   * {
   *   "error": true,
   *   "reason": "Internal server error"
   * }
   */
  async createTeacher(req, res) {
    try {
      const {
        firstName,
        lastName,
        gender,
        email,
        phone,
        dob,
        signature,
        bankDetails, // pending
        address,
      } = req.body;
      const { isAdmin } = req.user;
      if (!isAdmin) {
        return res
          .status(400)
          .json({ error: true, reason: "You are not Admin" });
      }

      if (!firstName) {
        return res
          .status(400)
          .json({ error: true, message: "First name is required" });
      }
      if (!lastName) {
        return res
          .status(400)
          .json({ error: true, message: "Last name is required" });
      }
      if (!gender) {
        return res
          .status(400)
          .json({ error: true, message: "Gender is required" });
      }

      if (!phone) {
        return res
          .status(400)
          .json({ error: true, message: "Phone number is required" });
      }
      if (!dob) {
        return res
          .status(400)
          .json({ error: true, message: "Date of birth is required" });
      }

      const dateOfBirth = moment(dob, "DD/MM/YYYY", true);
      if (!dateOfBirth.isValid()) {
        return res.status(400).json({
          error: true,
          message: "Invalid date of birth format. Use DD/MM/YYYY.",
        });
      }

      // check user already exists
      const checkUserData = await User.findOne({ phone, email })
        .select("email phone")
        .exec();

      if (checkUserData !== null) {
        // if email match
        if (
          email !== undefined &&
          checkUserData.email === email.toLowerCase()
        ) {
          throw new Error("Email already use, please provide an unique email");
        }

        // if phone match
        if (checkUserData.phone === phone) {
          throw new Error(
            "Phone number already use, please provide an unique phone number"
          );
        }
      }

      const randomStr = randomstring.generate({
        length: 8,
        charset: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
      });

      const username = firstName.slice(0, 3) + phone.slice(-3);
      const password = randomStr;

      const customer = await stripe.customers.create({
        email,
      });

      const user = await User.create({
        firstName,
        lastName,
        gender,
        email,
        dob: dateOfBirth,
        _school: req.user._school,
        _addedBy: req.user.id,
        joinDate: new Date(),
        signature,
        username,
        password,
        loginType: "teacher",
        bankDetails,
        bankAdded: bankDetails !== undefined ? true : false,
        isActive: true,
        customerStripeId: customer.id,
        address,
      });

      const schoolName = await School.findOne({ _id: req.user._school })
        .select("name")
        .lean()
        .exec();

      if (user.email !== undefined) {
        try {
          await mail("teacher-welcome", {
            to: user.email,
            subject: `Welcome to ${schoolName.name}`,
            locals: {
              email: user.email,
              firstName,
              password,
              schoolName: schoolName.name,
            },
          });
        } catch (error) {
          console.error(error).message;
          return res.status(400).json({ error: true, Error: error.message });
        }
      }
      return res.status(200).json({ error: true, user });
    } catch (error) {
      return res.status(500).json({ error: true, Error: error.message });
    }
  },

  /**
   * @api {put} /teacher/update/:id Update Teacher Details
   * @apiName UpdateTeacher
   * @apiGroup Teacher
   *
   * @apiHeader {String} Authorization Bearer token for admin access.
   *
   * @apiParam {String} id Teacher's unique ID.
   *
   * @apiParam {String} [firstName] Teacher's first name.
   * @apiParam {String} [lastName] Teacher's last name.
   * @apiParam {String} [email] Teacher's email.
   * @apiParam {Boolean} [isActive] Indicates if the teacher is active.
   * @apiParam {String} [phone] Teacher's phone number.
   * @apiParam {Object} [bankDetails] Teacher's bank details.
   * @apiParam {String} [address] address of the teacher
   *
   *
   * @apiSuccessExample {json} Success-Response:
   * {
   *   "error": false,
   *   "user": {
   *     "_id": "60d5f60c9b4d7635e8aebaf7",
   *     "firstName": "John",
   *     "lastName": "Doe",
   *     "email": "john.doe@example.com",
   *     "phone": "1234567890",
   *     "isActive": true,
   *     "bankDetails": {
   *       "accountNumber": "123456789",
   *       "ifscCode": "IFSC0001"
   *     }
   *   }
   * }
   *
   * @apiError NotAdmin You are not an admin.
   * @apiErrorExample {json} Error-Response:
   * {
   *   "error": true,
   *   "reason": "You are not Admin"
   * }
   *
   * @apiError NoUserFound No teacher found with the given ID.
   * @apiErrorExample {json} Error-Response:
   * {
   *   "error": true,
   *   "message": "No User Found"
   * }
   *
   * @apiError InternalServerError Internal server error.
   * @apiErrorExample {json} Error-Response:
   * {
   *   "error": true,
   *   "reason": "Internal server error"
   * }
   */
  async updateTeacher(req, res) {
    try {
      const { isAdmin } = req.user;

      if (!isAdmin) {
        return res
          .status(400)
          .json({ error: true, reason: "You are not Admin" });
      }

      const {
        firstName,
        lastName,
        email,
        isActive,
        phone,
        bankDetails,
        address,
      } = req.body;

      const user = await User.findOne({
        _id: req.params.id,
        loginType: "teacher",
        isActive: true,
      })
        .select("firstName lastName phone email isActive")
        .exec();

      if (user === null) {
        return res.status(400).json({ error: true, message: "No User Found" });
      }

      if (firstName !== undefined) user.firstName = firstName;
      if (lastName !== undefined) user.lastName = lastName;
      if (phone !== undefined) user.phone = phone;
      if (isActive !== undefined) user.isActive = isActive;
      if (bankDetails !== undefined) {
        user.bankDetails = bankDetails;
        user.bankAdded = true;
      }
      if (email !== undefined) {
        user.email = email;
      }
      if (address !== undefined) user.address = address;

      await user.save();
      return res.status(200).json({ error: false, user });
    } catch (error) {
      return res.status(500).json({ error: true, Error: error.message });
    }
  },

  // delete teacher using :id
  async deleteTeacher(req, res) {
    try {
      const { isAdmin } = req.user;
      if (!isAdmin) {
        return res
          .status(400)
          .json({ error: true, reason: "You are not Admin" });
      }

      const user = await User.findOne({ _id: req.params.id }).exec();
      if (user === null) {
        return res.status(400).json({ error: true, reason: "No such Admin" });
      }

      await User.deleteOne({ _id: req.params.id });
      return res
        .status(200)
        .json({ error: false, reason: "Teacher Has Been Deleted" });
    } catch (error) {
      return res.status(400).json({ error: true, reason: error });
    }
  },
};
