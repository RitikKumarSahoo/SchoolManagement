const User = require("../../models/user");
const School = require("../../models/school");
const randomstring = require("randomstring");
const mail = require("../../lib/mail");
const moment = require("moment");
const { request } = require("express");
const { Readable } = require("stream");
const csv = require("csv-parser");
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
   * @apiDescription Retrieves all teachers belonging to the school.
   *
   * @apiHeader {String} Authorization Bearer token for admin authentication.
   *
   * @apiParam {Number} pageNumber=1 Page number (starting from 1) sent within the params.
   * @apiParam {Number} pageSize=10 Number of records to return (default is 10) sent within the params.
   *
   * @apiSuccessExample Success Response:
   *  HTTP/1.1 200 OK
   * {
   *    "error": false,
   *    "message": "Teachers retrieved successfully.",
   *    "data": [
   *        {
   *            "qualification": "",
   *            "experience": "2",
   *            "address": {
   *                "city": "New York",
   *                "country": "USA",
   *                "locality": "Greenwood Avenue",
   *                "pin": "10001",
   *                "state": "NY"
   *            },
   *            "subject": [],
   *            "_id": "671b8f3e792331ab10d6a525",
   *            "username": "ritsch855",
   *            "firstName": "Ritik",
   *            "lastName": "Sahoo",
   *            "email": "ritik133@gmail.com",
   *            "accountType": "email",
   *            "gender": "Male",
   *            "dob": "2001-04-06T00:00:00Z",
   *            "loginType": "teacher",
   *            "_addedBy": "671a88862e586338c6c94518",
   *            "isActive": true,
   *            "isSuperAdmin": false,
   *            "bankAdded": false,
   *            "_school": "671a88862e586338c6c94516",
   *            "isPaid": false,
   *            "messagingEnabled": false,
   *            "createdAt": "2024-10-25T12:29:50.885Z",
   *            "updatedAt": "2024-10-25T15:57:04.821Z",
   *            "__v": 0,
   *            "phone": "8712302804",
   *            "joinDate": "2024-04-06T05:30:00Z",
   *            "id": "671b8f3e792331ab10d6a525"
   *        }
   *    ],
   *    "totalTeachers": 5
   * }
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
      let { pageNumber, pageSize } = req.body;

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
          .sort({ createdAt: -1 })
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
   * @apiParam {String} [searchText] Optional search text to filter teachers by `firstName`, `lastName`, `email`,`gender` `phone`.
   * @apiParam  {Number} pageNumber="1" page number (start with 1) send within the params
   * @apiParam  {Number} pageSize="10" number of data send within the params
   *
   * @apiSuccessExample {json} Success-Response:
   * HTTP/1.1 200 OK
   * {
   * "error": false,
   * "users": [
   *    {
   *         "address": {
   *             "city": "New York",
   *             "country": "USA",
   *             "locality": "Greenwood Avenue",
   *             "pin": "10001",
   *             "state": "NY"
   *         },
   *         "_id": "670cf24bdbb09a7c2b2af9a0",
   *         "username": "sri990",
   *         "firstName": "Sritam",
   *         "lastName": "mohapatra123",
   *         "email": "bonysahoo133@gmail.com",
   *         "accountType": "email",
   *         "gender": "Male",
   *         "dob": "2000-02-20",
   *         "loginType": "teacher",
   *         "_addedBy": "670cf177dbb09a7c2b2af98b",
   *         "isActive": true,
   *         "joinDate": "Sat Apr 06 2024 05:30:00 GMT+0530 (India Standard Time)",
   *         "bankAdded": false,
   *         "_school": "670cc3c55aa29e2e31348c7e",
   *         "customerStripeId": "cus_R1pATMqHh7GKzy",
   *         "isPaid": false,
   *        "messagingEnabled": false,
   *         "subject": [],
   *         "qualification":"",
   *         "experience":"2"
   *         "createdAt": "2024-10-14T10:28:27.463Z",
   *         "updatedAt": "2024-11-03T14:09:21.434Z",
   *         "__v": 0,
   *         "isSuperAdmin": false,
   *         "fullName": "Sritam mohapatra123",
   *         "id": "670cf24bdbb09a7c2b2af9a0"
   *     }
   * ],
   * "usersCount": 1
   *   }
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
      let { searchText, pageNumber = 1, pageSize = 10 } = req.body;

      // Error if the user is not a super admin or admin
      if (!(loginType === "admin" || isSuperAdmin === true)) {
        return res
          .status(403)
          .json({ error: true, reason: "Unauthorized access" });
      }

      const skipNumber = (pageNumber - 1) * pageSize;

      let query = {
        loginType: "teacher",
        isActive: true,
        _school,
      };

      if (searchText) {
        const searchRegex = new RegExp(searchText.trim(), "i");
        query.$or = [
          { firstName: { $regex: searchRegex } },
          { lastName: { $regex: searchRegex } },
          { email: { $regex: searchRegex } },
          { phone: { $regex: searchRegex } },
          { gender: { $regex: searchRegex } },
        ];
      }

      const [users, usersCount] = await Promise.all([
        User.find(query)
          .select("-password -bankDetails -forgotpassword")
          .sort({ createdAt: -1 })
          .skip(skipNumber)
          .limit(Number(pageSize))
          .exec(),
        User.countDocuments(query),
      ]);

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
   *     "isActive": true,
   *     "address": {
   *       "locality": "",
   *       "state": "",
   *       "city": "",
   *       "pin": "",
   *       "country": ""
   *     },
   *     "subject": ["Math", "English"],
   *     "qualification": "PhD",
   *     "experience": "5",
   *     "_school": "",
   *     "joinDate": "2021-09-01T00:00:00.000Z",
   *     "fullName": "John Doe",
   *     "isSuperAdmin": false,
   *     "bankAdded": false,
   *     "isPaid": false,
   *     "messagingEnabled": false,
   *     "createdAt": "2021-09-01T00:00:00.000Z",
   *     "updatedAt": "2021-09-01T00:00:00.000Z",
   *     "__v": 0
   *   }
   * }
   *
   * @apiError {Boolean} error Indicates if there was an error (true if failed).
   * @apiError {String} reason Error message explaining the reason.
   *
   * @apiErrorExample {json} Error-Response:
   * {
   *   "error": true,
   *   "reason": "You are not Admin"
   * }
   *
   * @apiErrorExample {json} Error-Response:
   * {
   *   "error": true,
   *   "reason": "No teacher found"
   * }
   *
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
   * @api {post} /admin/teacher/create Create Teacher
   * @apiName CreateTeacher
   * @apiGroup Teacher
   * @apiPermission admin, superAdmin
   *
   * @apiHeader {String} Authorization Bearer token access.
   *
   * @apiParam {String} [schoolId] school id(only use when superadmin will create )
   *
   * @apiExample Request-Example:
   * {
   *   "firstName": "Sahil",
   *   "lastName": "Sahu",
   *   "gender": "Male",
   *   "email": "sahil123@gmail.com",
   *   "phone": "9668123060",
   *   "dob": "06/04/2001",
   *   "signature": "base64EncodedSignature",
   *   "schoolId":""
   *   "bankDetails": {
   *     "bankName": "Bank of Odisha",
   *     "accountNumber": "123456789012",
   *     "ifscCode": "BKID0001234"
   *   },
   *   "address": {
   *     "locality": "Dhanupali",
   *     "city": "Sambalpur",
   *     "state": "Odisha",
   *     "pin": "768005",
   *     "country": "India"
   *   },
   *   "profileImage": "https://example.com/profile.jpg",
   *   "schoolId": "671a88862e586338c6c94516",
   *   "subject": ["Math", "English"],
   *   "qualification": "PhD",
   *   "experience": "5 years",
   *   "joinDate": "2024-11-01"
   * }
   *
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
   *     "dob": "DD/MM/YYYY",
   *     "isActive": true,
   *     "address": {
   *       "locality": "Dhanupali",
   *       "city": "Sambalpur",
   *       "state": "Odisha",
   *       "pin": "768005",
   *       "country": "India"
   *     },
   *     "subject": ["Math", "English"],
   *     "qualification": "PhD",
   *     "experience": "5",
   *     "joinDate": "2024-11-01",
   *     "profileImage": "https://example.com/profile.jpg",
   *     "createdAt": "2024-11-01T19:14:42.334Z",
   *     "updatedAt": "2024-11-02T21:24:44.423Z"
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
   *   "message": "Email already in use, please provide a unique email."
   * }
   *
   * @apiError PhoneExists Phone number already in use.
   * @apiErrorExample {json} Error-Response:
   * {
   *   "error": true,
   *   "message": "Phone number already in use, please provide a unique phone number."
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
        subject,
        qualification,
        experience,
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
      if (email === undefined) {
        return res
          .status(400)
          .json({ error: true, message: "Email is required" });
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

      if (isSuperAdmin === true) {
        if (schoolId === undefined) {
          return res
            .status(400)
            .json({ error: true, reason: `Field "schoolId" is required` });
        }
      }

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
        subject,
        profileImage,
        qualification,
        experience,
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

      const response = await User.findOne({ email: user.email }).select(
        "-forgotpassword -password -bankDetails"
      );

      return res.status(200).json({ error: true, user: response });
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
   * @apiParam {Array}  [subject] array of string subject:["Math"]
   * @apiParam {String} [joinDate] joinDate
   * @apiParam {String} [qualification]
   * @apiParam {String} [experience]
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
   *     },
   *    "_school":"schoolid",
   *    "profileImage":"",
   *    "subject":["Math","English"]
   *    "joinDate":"",
   *    "experience":"",
   *    "qualification:""
   *
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
        dob,
        bankDetails,
        address,
        profileImage,
        subject,
        joinDate,
        experience,
        qualification,
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
      if (subject !== undefined) user.subject = subject;
      if (profileImage !== undefined) user.profileImage = profileImage;
      if (joinDate !== undefined) user.joinDate = joinDate;
      if (qualification !== undefined) user.qualification = qualification;
      if (experience !== undefined) user.experience = experience;
      if (dob !== undefined) user.dob = dob;

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
   * @api {delete} /admin/teacher/delete/:id Delete Teacher
   * @apiName DeleteTeacher
   * @apiGroup Teacher
   * @apiPermission Admin or SuperAdmin
   *
   * @apiDescription Allows an admin to delete a teacher from their assigned school, and a superadmin to delete any teacher. For superadmins, an optional `schoolId` can be provided to ensure the teacher belongs to a specific school.
   *
   * @apiParam {String} id The ID of the teacher to delete.
   * @apiParam {String} [schoolId] (SuperAdmin only) Optional ID of the school to which the teacher must belong for deletion.
   *
   * @apiHeader {String} Authorization User's access token.
   *
   * @apiSuccess {Boolean} error Indicates if there was an error (false if successful).
   * @apiSuccess {String} reason Message indicating the result.
   *
   * @apiError (Error 400) {Boolean} error Indicates if there was an error.
   * @apiError (Error 400) {String} reason Reason for the error, e.g., "Teacher not found" or "You do not have permission to delete this teacher."
   * @apiError (Error 403) {Boolean} error Indicates if there was an error.
   * @apiError (Error 403) {String} reason Message indicating unauthorized action, e.g., "This teacher does not belong to the specified school."
   * @apiError (Error 500) {Boolean} error Indicates if there was an internal server error.
   * @apiError (Error 500) {String} reason Error message explaining the issue.
   *
   * @apiSuccessExample {json} Success Response (Admin or SuperAdmin):
   *    HTTP/1.1 200 OK
   *    {
   *      "error": false,
   *      "reason": "Teacher deleted successfully"
   *    }
   *
   * @apiErrorExample {json} Teacher Not Found (Error 400):
   *    HTTP/1.1 400 Bad Request
   *    {
   *      "error": true,
   *      "reason": "Teacher not found"
   *    }
   *
   * @apiErrorExample {json} Unauthorized Action (Error 403):
   *    HTTP/1.1 403 Forbidden
   *    {
   *      "error": true,
   *      "reason": "You do not have permission to delete this teacher"
   *    }
   *
   * @apiErrorExample {json} SuperAdmin School ID Mismatch (Error 403):
   *    HTTP/1.1 403 Forbidden
   *    {
   *      "error": true,
   *      "reason": "This teacher does not belong to the specified school"
   *    }
   */

  async deleteTeacher(req, res) {
    try {
      const { isSuperAdmin, loginType, _school } = req.user;
      const { id } = req.params;
      const { schoolId } = req.body;

      const user = await User.findOne({ _id: id }).exec();
      if (user === null || user.loginType !== "teacher") {
        return res
          .status(400)
          .json({ error: true, reason: "Teacher not found" });
      }

      // Check if user is an admin and can only delete teachers from their school
      if (loginType === "admin" && String(user._school) !== String(_school)) {
        return res.status(403).json({
          error: true,
          reason: "You do not have permission to delete this teacher",
        });
      }

      // If user is a superadmin
      if (isSuperAdmin === true) {
        if (
          schoolId !== undefined &&
          String(user._school) !== String(schoolId)
        ) {
          return res.status(403).json({
            error: true,
            reason: "This teacher does not belong to the specified school",
          });
        }
      }

      await User.deleteOne({ _id: id });
      return res
        .status(200)
        .json({ error: false, reason: "Teacher deleted successfully" });
    } catch (error) {
      return res.status(500).json({ error: true, reason: error.message });
    }
  },
  /**
   * @api {post} /bulkCreateTeachers Bulk Create Teachers
   * @apiName BulkCreateTeachers
   * @apiGroup Teacher
   * @apiPermission SuperAdmin, Admin
   *
   * @apiDescription Creates multiple teacher records from a CSV file. The request requires a CSV file with each row containing teacher details.
   *
   * @apiHeader {String} Authorization Bearer token for authentication.
   *
   * @apiParam {File} file CSV file containing teacher data. Required fields: `firstName`, `lastName`, `gender`, `phone`. Optional fields include `email`, `dob`, `joinDate`, `profileImage`, `signature`, `bankDetails`, `address`, `schoolId`, and `subject`.
   *
   * @apiSuccess {String} message Success message showing the count of created teachers.
   * @apiSuccess {Object[]} results List of successfully created teachers.
   * @apiSuccess {Boolean} results.error Indicates if the teacher creation was successful (false).
   * @apiSuccess {Object} results.user Created teacher's data.
   * @apiSuccess {String} results.user.firstName Teacher's first name.
   * @apiSuccess {String} results.user.lastName Teacher's last name.
   * @apiSuccess {String} results.user.email Teacher's email address.
   * @apiSuccess {String} results.user.phone Teacher's phone number.
   * @apiSuccess {Date} results.user.dob Teacher's date of birth.
   * @apiSuccess {String} results.user.username Generated username for the teacher.
   * @apiSuccess {Object[]} errors List of errors encountered during creation.
   * @apiSuccess {Object} errors.teacherData Data from the CSV row that caused the error.
   * @apiSuccess {String} errors.error Description of the error.
   *
   * @apiSuccessExample {json} Success Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "message": "3 teachers created",
   *       "results": [
   *         {
   *           "error": false,
   *           "user": {
   *             "firstName": "John",
   *             "lastName": "Doe",
   *             "email": "john@school.com",
   *             "phone": "1234567890",
   *             "dob": "06/04/2001",
   *             "username": "Johsch890"
   *           }
   *         },
   *         {
   *           "error": false,
   *           "user": {
   *             "firstName": "Jane",
   *             "lastName": "Smith",
   *             "email": "jane@school.com",
   *             "phone": "0987654321",
   *             "dob": "02/02/1999",
   *             "username": "Jansch321"
   *           }
   *         },
   *         {
   *           "error": false,
   *           "user": {
   *             "firstName": "Asit",
   *             "lastName": "Raj",
   *             "email": "asit@school.com",
   *             "phone": "98223682221",
   *             "dob": "01/11/2001",
   *             "username": "Asisch221"
   *           }
   *         }
   *       ],
   *       "errors": [
   *         {
   *           "teacherData": {
   *             "firstName": "Jane",
   *             "lastName": "Smith",
   *             "gender": "Female",
   *             "email": "tim@school.com",
   *             "phone": "0987654376",
   *             "dob": "02/02/1999",
   *             "subject": "['Math'",
   *             "_7": "'English']"
   *           },
   *           "error": "Email already in use. Provide a unique email."
   *         }
   *       ]
   *     }
   *
   * @apiError {Boolean} error Status of the request (true if an error occurred).
   * @apiError {String} message Error message if the request fails.
   *
   * @apiErrorExample {json} Unauthorized Access:
   *     HTTP/1.1 400 Bad Request
   *     {
   *       "error": true,
   *       "reason": "You do not have permission to create teachers"
   *     }
   *
   * @apiErrorExample {json} File Missing:
   *     HTTP/1.1 400 Bad Request
   *     {
   *       "error": true,
   *       "message": "CSV file is required"
   *     }
   *
   * @apiErrorExample {json} Internal Server Error:
   *     HTTP/1.1 500 Internal Server Error
   *     {
   *       "error": true,
   *       "message": "An error message explaining the failure"
   *     }
   */

  async bulkCreateTeachers(req, res) {
    try {
      const { isSuperAdmin, loginType, _school } = req.user;

      if (!(isSuperAdmin || loginType === "admin")) {
        return res.status(400).json({
          error: true,
          reason: "You do not have permission to create teachers",
        });
      }

      const teachers = [];
      const errors = [];

      if (!req.file || !req.file.buffer) {
        return res
          .status(400)
          .json({ error: true, message: "CSV file is required" });
      }

      const readableStream = new Readable();
      readableStream.push(req.file.buffer);
      readableStream.push(null);

      readableStream
        .pipe(csv())
        .on("data", (row) => {
          teachers.push(row);
        })
        .on("end", async () => {
          const results = [];
          for (const teacherData of teachers) {
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
                bankDetails,
                address,
                schoolId,
                subject,
              } = teacherData;
              console.log(subject);

              const subjectArray = subject
                ? subject.includes("|")
                  ? subject
                      .split("|")
                      .map((s) => s.trim().replace(/^'|'$/g, ""))
                  : [subject.trim().replace(/^'|'$/g, "")]
                : [];

              if (!firstName || !lastName || !gender || !phone) {
                throw new Error("Missing required fields");
              }

              const dateOfBirth = moment(dob, "DD/MM/YYYY", true);
              if (!dateOfBirth.isValid()) {
                throw new Error(
                  "Invalid date of birth format. Use DD/MM/YYYY."
                );
              }

              // Check for duplicate email or phone
              const existingUser = await User.findOne({
                $or: [{ email }, { phone }],
              })
                .select("email phone")
                .exec();

              if (existingUser) {
                if (existingUser.email === email) {
                  throw new Error(
                    "Email already in use. Provide a unique email."
                  );
                }
                if (existingUser.phone === phone) {
                  throw new Error(
                    "Phone number already in use. Provide a unique phone number."
                  );
                }
              }

              const school = await School.findOne({
                _id: isSuperAdmin ? req.body.schoolId : _school,
              })
                .select("_id name")
                .exec();

              if (!school) {
                throw new Error("School not found");
              }

              const username = `${firstName.slice(0, 3)}${school.name.slice(
                0,
                3
              )}${phone.slice(-3)}`;
              const password = generateCustomPassword();

              const user = await User.create({
                firstName,
                lastName,
                gender,
                email,
                dob: dateOfBirth.toDate(),
                _school: isSuperAdmin ? schoolId : _school,
                _addedBy: req.user.id,
                joinDate,
                signature,
                username,
                phone,
                password,
                loginType: "teacher",
                bankDetails,
                bankAdded: !!bankDetails,
                isActive: true,
                address,
                subject: subjectArray,
                profileImage,
              });

              results.push({
                error: false,
                user: {
                  firstName,
                  lastName,
                  email,
                  phone,
                  dob,
                  phone,
                  username,
                },
              });
            } catch (error) {
              errors.push({
                teacherData,
                error: error.message,
              });
            }
          }

          return res.status(200).json({
            message: `${results.length} teachers created`,
            results,
            errors,
          });
        });
    } catch (error) {
      return res.status(500).json({ error: true, message: error.message });
    }
  },
};
