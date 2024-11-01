const User = require("../../models/user");
const School = require("../../models/school");
const randomstring = require("randomstring");
const mail = require("../../lib/mail");
const moment = require("moment");
const { request } = require("express");
const stripe = require("stripe")(
  "sk_test_51Pt2xx1xyS6eHcGHSrfLdSfyQQESKMatwXTA28TYmUMCXpnI2zjv1auMtdIZSyV771lqArWjZlXzFXE9yt87mbdS00ypiNeR0x"
);

function generateCustomPassword() {
  const upperCaseLetter = randomstring.generate({
    length: 1,
    charset: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  });
  const lowerCaseLetters = randomstring.generate({
    length: 3,
    charset: "abcdefghijklmnopqrstuvwxyz",
  });
  const specialChar = randomstring.generate({
    length: 1,
    charset: "!@#$%^&*()_+[]{}|;:,.<>?/",
  });
  const numbers = randomstring.generate({
    length: 3,
    charset: "0123456789",
  });
  const password = upperCaseLetter + lowerCaseLetters + specialChar + numbers;
  return password;
}

module.exports = {
  /**
   * @api {post} /admin/teachers Get All Teachers
   * @apiName GetAllTeachers
   * @apiGroup Teacher
   * @apiVersion 1.0.0
   * @apiDescription Retrieves all teachers belonging to the school
   *
   * @apiHeader {String} Authorization Bearer token for admin authentication.
   *
   * @apiParam  {Number} pageNumber="1" page number (start with 1) send within the params
   * @apiParam  {Number} pageSize="10" number of data send within the params
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
      const { _school, loginType } = req.user;
      const { pageNumber, pageSize } = req.body;

      if (pageNumber === undefined) {
        pageNumber = 1;
      } else {
        pageNumber = Number(pageNumber);
      }
      // here check pagesize else set default
      if (pageSize === undefined) {
        pageSize = 10;
      } else {
        pageSize = Number(pageSize);
      }
      const skipNumber = (pageNumber - 1) * pageSize;

      if (loginType === "admin") {
        const teachers = await User.find({
          loginType: "teacher",
          _school: _school,
        })
          .select("-password -bankDetails -forgotpassword")
          .skip(skipNumber)
          .limit(pageSize)
          .exec();

        if (teachers.length === 0) {
          return res.status(404).json({
            error: true,
            message: "No teachers found for this school.",
          });
        }
        const totalTeachers = await User.countDocuments({
          loginType: "teacher",
          _school,
        });

        return res.status(200).json({
          error: false,
          message: "Teachers retrieved successfully.",
          data: teachers,
          totalTeachers,
        });
      }

      if (req.user.isSuperAdmin === true) {
        const teachers = await User.find({
          loginType: "teacher",
        })
          .select("-password -bankDetails -forgotpassword")
          .skip(skipNumber)
          .limit(pageSize)
          .exec();

        if (teachers.length === 0) {
          return res.status(404).json({
            error: true,
            message: "No teachers found",
          });
        }
        const totalTeachers = await User.countDocuments({
          loginType: "teacher",
        });

        return res.status(200).json({
          error: false,
          message: "Teachers retrieved successfully.",
          data: teachers,
          totalTeachers,
        });
      }
      return res.status(200).json({ error: true, reason: "You are not admin" });
    } catch (error) {
      return res.status(500).json({
        error: true,
        reason: error.message,
      });
    }
  },

  /**
   * @api {post} /admin/teacher/find Find Teachers
   * @apiName FindTeachers
   * @apiGroup Teacher
   * @apiDescription Allows super admins and admins to search for teachers. Super admins can search all teachers, while admins can only search teachers in their assigned school.
   *
   * @apiHeader {String} Authorization Bearer token for admin or super admin access.
   *
   * @apiParam {String} [searchText] Optional search text to filter teachers by `firstName`, `lastName`, `email`, `joinDate`,`gender` `phone`.
   * @apiParam  {Number} pageNumber="1" page number (start with 1) send within the params
   * @apiParam  {Number} pageSize="10" number of data send within the params
   *
   * @apiSuccessExample {json} Success-Response:
   * HTTP/1.1 200 OK
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
   * @apiError UnauthorizedAccess Unauthorized access (not an admin or super admin).
   * @apiErrorExample {json} Unauthorized-Response:
   * HTTP/1.1 403 Forbidden
   * {
   *   "error": true,
   *   "reason": "Unauthorized access"
   * }
   *
   * @apiError NoTeachersFound No teachers found matching the search criteria.
   * @apiErrorExample {json} NoTeachers-Response:
   * HTTP/1.1 404 Not Found
   * {
   *   "error": true,
   *   "reason": "No teacher found"
   * }
   *
   * @apiError InternalServerError Internal server error.
   * @apiErrorExample {json} InternalServerError-Response:
   * HTTP/1.1 500 Internal Server Error
   * {
   *   "error": true,
   *   "reason": "Internal server error"
   * }
   */

  async find(req, res) {
    try {
      const { isSuperAdmin, loginType, _school } = req.user;
      const { searchText, pageNumber, pageSize } = req.body;

      //error user is either a superadmin or an admin
      if (!(loginType === "admin" || isSuperAdmin === true)) {
        return res
          .status(403)
          .json({ error: true, reason: "Unauthorized access" });
      }

      if (pageNumber === undefined) {
        pageNumber = 1;
      } else {
        pageNumber = Number(pageNumber);
      }
      // here check pagesize else set default
      if (pageSize === undefined) {
        pageSize = 10;
      } else {
        pageSize = Number(pageSize);
      }
      const skipNumber = (pageNumber - 1) * pageSize;

      const query = {
        loginType: "teacher",
        isActive: true,
      };

      if (isSuperAdmin === false) {
        query._school = _school;
      }

      if (searchText) {
        const searchRegex = new RegExp(searchText.trim(), "i");
        query.$or = [
          { firstName: { $regex: searchRegex } },
          { lastName: { $regex: searchRegex } },
          { email: { $regex: searchRegex } },
          { phone: { $regex: searchRegex } },
          { gender: { $regex: searchText } },
          { joinDate: { $regex: searchText } },
        ];
      }

      const users = await User.find(query)
        .select("-password -bankDetails -forgotpassword")
        .skip(skipNumber)
        .limit(pageSize)
        .exec();

      const usersCount = await User.countDocuments(query);

      if (users.length === 0) {
        return res
          .status(404)
          .json({ error: true, reason: "No teacher found" });
      }

      return res.status(200).json({ error: false, users, usersCount });
    } catch (error) {
      return res.status(500).json({ error: true, reason: error.message });
    }
  },

  /**
   * @api {get} /admin/teacher/get/:id Get Teacher Details
   * @apiName GetTeacherDetails
   * @apiGroup Teacher
   *
   * @apiHeader {String} Authorization Bearer token for admin or superadmin access.
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
      const { isSuperAdmin, loginType, _school } = req.user;

      if (!(isSuperAdmin === true || loginType === "admin")) {
        return res
          .status(403)
          .json({ error: true, reason: "Unauthorized access" });
      }

      const query = {
        loginType: "teacher",
        _id: req.params.id,
      };

      if (!isSuperAdmin) {
        query._school = _school;
      }

      const user = await User.findOne(query).select(
        "-password -forgotpassword"
      );
      if (!user) {
        return res
          .status(404)
          .json({ error: true, reason: "No teacher found" });
      }

      return res.status(200).json({ error: false, user });
    } catch (error) {
      return res.status(500).json({ error: true, reason: error.message });
    }
  },

  /**
   * @api {post} admin/teacher/create Create Teacher
   * @apiName CreateTeacher
   * @apiGroup Teacher
   * @apiPermission admin,superAdmin
   *
   * @apiHeader {String} Authorization Bearer token access.
   *
   * @apiParam {String} firstName First name of the teacher.
   * @apiParam {String} lastName Last name of the teacher.
   * @apiParam {String} gender Gender of the teacher (e.g., Male, Female).
   * @apiParam {String} email Email of the teacher (must be unique).
   * @apiParam {String} phone Phone number of the teacher (must be unique).
   * @apiParam {String} dob Date of birth of the teacher in DD/MM/YYYY format.
   * @apiParam {String} [signature] Optional signature of the teacher.
   * @apiParam {Object} [bankDetails] Optional bank details of the teacher.
   * @apiParam {Object} [address] address of the teacher
   * @apiParam {String} [profileImage] image url of the teacher
   * @apiParam {String} [schoolId] school id(only use when superadmin will create )
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
   *     "customerStripeId": "cus_123456789",
   *     "address":{
   *        "locality":"",
   *        "city":"",
   *        "state":"",
   *        "pin":"",
   *        "country":""
   *      }
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
        joinDate,
        profileImage,
        signature,
        bankDetails, // pending
        address,
        schoolId,
      } = req.body;
      const { isSuperAdmin, loginType } = req.user;

      if (!(isSuperAdmin === true || loginType === "admin")) {
        return res.status(400).json({
          error: true,
          reason: "You do not have permission to  update teacher",
        });
      }

      if (firstName === undefined) {
        return res
          .status(400)
          .json({ error: true, message: "First name is required" });
      }
      if (lastName === undefined) {
        return res
          .status(400)
          .json({ error: true, message: "Last name is required" });
      }
      if (gender === undefined) {
        return res
          .status(400)
          .json({ error: true, message: "Gender is required" });
      }

      if (phone === undefined) {
        return res
          .status(400)
          .json({ error: true, message: "Phone number is required" });
      }

      const dateOfBirth = moment(dob, "DD/MM/YYYY", true);
      if (!dateOfBirth.isValid()) {
        return res.status(400).json({
          error: true,
          message: "Invalid date of birth format. Use DD/MM/YYYY.",
        });
      }

      // check user already exists
      const checkUserData = await User.findOne({ email })
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

      const randomStr = generateCustomPassword();

      const existSchool = await School.findOne({ _id: req.user._school })
        .select("_id name")
        .exec();

      const username =
        firstName.slice(0, 3) + existSchool.name.slice(0, 3) + phone.slice(-3);
      const password = randomStr;

      const user = await User.create({
        firstName,
        lastName,
        gender,
        email,
        dob: dateOfBirth,
        _school: isSuperAdmin === true ? schoolId : req.user._school,
        _addedBy: req.user.id,
        joinDate,
        signature,
        username,
        phone,
        password,
        loginType: "teacher",
        bankDetails,
        bankAdded: bankDetails !== undefined ? true : false,
        isActive: true,
        address,
        profileImage,
      });

      const schoolName = await School.findOne({ _id: req.user._school })
        .select("name")
        .lean()
        .exec();

      // if (user.email !== undefined) {
      //   try {
      //     await mail("teacher-welcome", {
      //       to: user.email,
      //       subject: `Welcome to ${schoolName.name}`,
      //       locals: {
      //         username,
      //         firstName,
      //         password,
      //         schoolName: schoolName.name,
      //       },
      //     });
      //   } catch (error) {
      //     console.error(error).message;
      //     return res.status(400).json({ error: true, Error: error.message });
      //   }
      // }
      return res.status(200).json({ error: true, user });
    } catch (error) {
      return res.status(500).json({ error: true, Error: error.message });
    }
  },

  /**
   * @api {put} admin/teacher/update/:id Update Teacher Details
   * @apiName UpdateTeacher
   * @apiGroup Teacher
   * @apiPermission admin,superadmin
   *
   * @apiHeader {String} Authorization Bearer token for admin,superadmin access.
   *
   * @apiParam {String} id Teacher's unique ID.
   *
   * @apiParam {String} [firstName] Teacher's first name.
   * @apiParam {String} [lastName] Teacher's last name.
   * @apiParam {String} [email] Teacher's email.
   * @apiParam {Boolean} [isActive] Indicates if the teacher is active.
   * @apiParam {String} [phone] Teacher's phone number.
   * @apiParam {Object} [bankDetails] Teacher's bank details.
   * @apiParam {Object} [address] address of the teacher
   * @apiParam {String} [profileImage] image url of the teacher
   * @apiParam {String} [_school]  school id
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
   *    "address":{
   *    "locality":"",
   *    "city":"",
   *    "state":"",
   *    "pin":"",
   *    "country":""
   * },
   *    "_school":"schoolid",
   *    "profileImage":""
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
      const { loginType, isSuperAdmin, _school } = req.user;
      const {
        firstName,
        lastName,
        email,
        isActive,
        phone,
        bankDetails,
        address,
        profileImage,
      } = req.body;

      if (loginType !== "admin" && isSuperAdmin === false) {
        return res.status(400).json({
          error: true,
          reason: "You are not authorized to update teacher details.",
        });
      }

      const user = await User.findOne({
        _id: req.params.id,
        loginType: "teacher",
      }).exec();

      if (!user) {
        return res
          .status(400)
          .json({ error: true, message: "No Teacher Found" });
      }

      // If admin, restrict update to teachers of the same school
      if (
        loginType === "admin" &&
        user._school.toString() !== _school.toString()
      ) {
        return res.status(400).json({
          error: true,
          message: "You can only update teachers assigned to your school.",
        });
      }

      if (firstName !== undefined) user.firstName = firstName;
      if (lastName !== undefined) user.lastName = lastName;
      if (phone !== undefined) user.phone = phone;
      if (isActive !== undefined) user.isActive = isActive;
      if (bankDetails !== undefined) {
        user.bankDetails = bankDetails;
        user.bankAdded = true;
      }
      if (email !== undefined) user.email = email;
      if (address !== undefined) {
        if (address.locality !== undefined)
          user.address.locality = address.locality;
        if (address.state !== undefined) user.address.state = address.state;
        if (address.city !== undefined) user.address.city = address.city;
        if (address.pin !== undefined) user.address.pin = address.pin;
        if (address.country !== undefined)
          user.address.country = address.country;
      }
      if (profileImage !== undefined) user.profileImage = profileImage;

      await user.save();
      return res.status(200).json({
        error: false,
        message: "Teacher profile updated successfully.",
      });
    } catch (error) {
      return res.status(500).json({ error: true, message: error.message });
    }
  },

  /**
   * @api {delete} /admin/teacher/delete/:id Delete Teacher by admin or superadmin
   * @apiName DeleteTeacher
   * @apiGroup Teacher
   * @apiPermission Admin or SuperAdmin
   *
   * @apiParam {String} id The ID of the teacher to be deleted (as URL parameter).
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "error": false,
   *       "reason": "user deleted"
   *     }
   *
   * @apiErrorExample Error-Response (No Permission):
   *     HTTP/1.1 400 Bad Request
   *     {
   *       "error": true,
   *       "reason": "You do not have permission to delete teacher"
   *     }
   *
   * @apiErrorExample Error-Response (Teacher Not Found):
   *     HTTP/1.1 400 Bad Request
   *     {
   *       "error": true,
   *       "reason": "teacher not found"
   *     }
   */

  async deleteTeacher(req, res) {
    try {
      if (req.user.loginType === "admin" || req.user.isSuperAdmin === true) {
        const user = await User.findOne({ _id: req.params.id }).exec();
        if (user === null) {
          return res
            .status(400)
            .json({ error: true, reason: "teacher not found" });
        }

        await User.deleteOne({ _id: req.params.id });
        return res.status(200).json({ error: false, reason: "user deleted" });
      }

      return res.status(400).json({
        error: true,
        reason: "You do not have permission to delete teacher",
      });
    } catch (error) {
      return res.status(400).json({ error: true, Error: error.message });
    }
  },
};
