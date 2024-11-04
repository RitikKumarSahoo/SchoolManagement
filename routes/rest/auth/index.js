const jwt = require("jsonwebtoken");

const User = require("../../../models/user");
const School = require("../../../models/school");
const randomstring = require("randomstring");
const mail = require("../../../lib/mail");
const moment = require("moment");

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
   *
   * @api {post} /login User login
   * @apiName userLogin
   * @apiGroup Auth
   * @apiVersion  1.0.0
   * @apiPermission Public
   *
   *
   * @apiParam  {String} handle (mobile / email / username)
   * @apiParam  {String} password user's password
   *
   * @apiSuccess (200) {json} name description
   *
   * @apiParamExample  {json} Request-Example:
   * {
   *     "handle" : "myEmail@logic-square.com",
   *     "password" : "myNewPassword"
   * }
   *
   *
   * @apiSuccessExample {json} Success-Response:
   * {
   *     "error" : false,
   *     "handle" : "myEmail@logic-square.com",
   *     "token": "authToken.abc.xyz"
   * }
   *
   *
   */
  async post(req, res) {
    try {
      const { handle, password } = req.body;
      if (handle === undefined || password === undefined) {
        return res.status(400).json({
          error: true,
          reason: "Fields `handle` and `password` are mandatory",
        });
      }

      // Find the user
      const user = await User.findOne({
        $or: [
          {
            email: handle.toLowerCase(),
          },
          {
            phone: handle,
          },
          {
            username: handle,
          },
        ],
      }).exec();
      if (user === null) throw new Error("User Not Found");
      if (user.isActive === false) throw new Error("User Inactive");
      // check pass
      await user.comparePassword(password);
      // No error, send jwt
      const payload = {
        id: user._id,
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        isAdmin: user.isAdmin,
        isActive: user.isActive,
        isSuperAdmin: user.isSuperAdmin || false,
        _school: user._school,
      };
      if (!user.isSuperAdmin) {
        payload.loginType = user.loginType;
      }
      const token = jwt.sign(payload, process.env.SECRET, {
        expiresIn: 3600 * 24 * 30, // 1 month
      });
      return res.json({
        error: false,
        handle,
        token,
      });
    } catch (err) {
      return res.status(500).json({
        error: true,
        reason: err.message,
      });
    }
  },
  /**
   * @api {put} /admin/update/:id Update users by superAdmin and admin
   * @apiName UpdateAdminProfile
   * @apiGroup Admin
   * @apiVersion 1.0.0
   * @apiPermission superadmin,admin
   *
   * @apiDescription This endpoint allows an admin to update their profile details, such as first name, last name, and phone number.
   *
   * @apiHeader {String} Authorization Bearer token for authorization.
   *
   * @apiParam {String} [firstName] The new first name of user.
   * @apiParam {String} [lastName] The new last name of the user.
   * @apiParam {String} [phone] The new phone number of the user.
   * @apiParam {String} [email] The new email of the user.
   * @apiParam {Object} [address] The new address of the user.
   * @apiParam {String} [gender] Gender of the user.
   * @apiParam {Date}   [dob] The DOB of the user.
   * @apiParam {Date} [joinDate] Join date of the user (ISO format).
   * @apiParam {Date} [leaveDate] Leave date of the user (ISO format).
   * @apiParam {String} [_school] School reference of the user.
   * @apiParam {String} [admissionYear] Admission year of the user (for students).
   * @apiParam {String} [rollNo] Roll number of the user (for students).
   *
   * @apiSuccess {Boolean} error Indicates whether the request encountered an error.
   * @apiSuccess {String} message Success message indicating the profile was updated.
   *
   * @apiError (400) {Boolean} error True if the user is not an admin or the admin was not found.
   * @apiError (500) {Boolean} error True if there was a server error.
   * @apiError {String} message Error message explaining the failure reason.
   *
   * @apiSuccessExample {json} Success-Response:
   * HTTP/1.1 200 OK
   * {
   *   "error": false,
   *   "message": "Admin profile updated successfully."
   * }
   *
   * @apiErrorExample {json} Error-Response (Admin not found):
   * HTTP/1.1 400 Bad Request
   * {
   *   "error": true,
   *   "reason": "Admin not found"
   * }
   *
   * @apiErrorExample {json} Error-Response (Not admin):
   * HTTP/1.1 400 Bad Request
   * {
   *   "error": true,
   *   "reason": "You are not admin"
   * }
   *
   * @apiErrorExample {json} Error-Response (Server error):
   * HTTP/1.1 500 Internal Server Error
   * {
   *   "error": true,
   *   "message": "An unexpected error occurred"
   * }
   */

  async updateAdmin(req, res) {
    try {
      const {
        firstName,
        lastName,
        phone,
        email,
        address,
        gender,
        dob,
        profileImage,
        admissionYear,
        _class,
        guardian,
        joinDate,
        leaveDate,
        _school,
        rollNo,
      } = req.body;
      const { isSuperAdmin, loginType } = req.user;

      if (isSuperAdmin === true) {
        const user = await User.findOne({
          _id: req.params.id,
        });

        if (user === null) {
          return res.status(400).json({
            error: true,
            reason: "user not found",
          });
        }

        if (firstName !== undefined) user.firstName = firstName;
        if (lastName !== undefined) user.lastName = lastName;
        if (phone !== undefined) user.phone = phone;
        if (email !== undefined) user.email = email;
        if (address !== undefined) {
          if (address.locality !== undefined) {
            user.address.locality = address.locality;
          }
          if (address.state !== undefined) user.address.state = address.state;
          if (address.city !== undefined) user.address.city = address.city;
          if (address.pin !== undefined) user.address.pin = address.pin;
          if (address.country !== undefined)
            user.address.country = address.country;
        }
        if (gender !== undefined) user.gender = gender;
        if (dob !== undefined) user.dob = dob;
        if (profileImage !== undefined) user.profileImage = profileImage;
        if (guardian !== undefined) user.guardian = guardian;
        if (_school !== undefined) user._school = _school;
        if (joinDate !== undefined) user.joinDate = joinDate;
        if (leaveDate !== undefined) user.leaveDate = leaveDate;
        if (rollNo !== undefined) user.rollNo = rollNo;

        await user.save();

        return res.status(200).json({
          error: false,
          message: "user profile updated successfully.",
        });
      }

      if (loginType === "admin") {
        const user = await User.findOne({
          _id: req.params.id,
          loginType: { $in: ["student", "teacher"] },
          _school: req.user._school,
        });

        if (user === null) {
          return res
            .status(400)
            .json({ error: true, reason: "User not found" });
        }

        if (firstName !== undefined) user.firstName = firstName;
        if (lastName !== undefined) user.lastName = lastName;
        if (phone !== undefined) user.phone = phone;
        if (email !== undefined) user.email = email;
        if (address !== undefined) {
          if (address.locality !== undefined) {
            user.address.locality = address.locality;
          }
          if (address.state !== undefined) user.address.state = address.state;
          if (address.city !== undefined) user.address.city = address.city;
          if (address.pin !== undefined) user.address.pin = address.pin;
          if (address.country !== undefined)
            user.address.country = address.country;
        }
        if (gender !== undefined) user.gender = gender;
        if (dob !== undefined) user.dob = dob;
        if (profileImage !== undefined) user.profileImage = profileImage;
        if (guardian !== undefined) user.guardian = guardian;
        if (_school !== undefined) user._school = _school;
        if (joinDate !== undefined) user.joinDate = joinDate;
        if (leaveDate !== undefined) user.leaveDate = leaveDate;
        if (_class !== undefined) user._class = _class;
        if (admissionYear !== undefined) user.admissionYear = admissionYear;
        if (rollNo !== undefined) user.rollNo = rollNo;

        await user.save();
        return res.status(200).json({
          error: false,
          message: "User profile updated successfully.",
        });
      }

      return res.status(400).json({
        error: true,
        reason: "You are not authorized to update this user",
      });
    } catch (error) {
      return res.status(500).json({ error: true, message: error.message });
    }
  },

  /**
   * @api {post} /createadmin/:id Create a new Admin
   * @apiName CreateAdmin
   * @apiGroup Admin
   * @apiPermission SuperAdmin
   *
   * @apiDescription This endpoint allows a super admin to create a new admin for a specific school.
   *
   * @apiParam {String} id The ID of the school to which the admin belongs (in URL parameter).
   * @apiParam {String} firstName The first name of the admin.
   * @apiParam {String} lastName The last name of the admin.
   * @apiParam {String} phone The phone number of the admin (must be unique).
   * @apiParam {String} email The email address of the admin (must be unique).
   * @apiParam {Object} address The address of the admin.
   * @apiParam {String} gender The gender of the admin.
   * @apiParam {String} dob The date of birth of the admin (format: DD/MM/YYYY).
   * @apiParam {String} profileImage The URL of the profile image of the admin.
   * @apiParam {String} joinDate The join date of the admin.
   * @apiParam {Object} bankDetails The bank details of the admin (optional).
   * @apiParam {String} signature The digital signature of the admin.
   *
   * @apiErrorExample {json} Unauthorized Access
   *     HTTP/1.1 400 Bad Request
   *     {
   *       "error": true,
   *       "reason": "You are not superadmin"
   *     }
   *
   * @apiErrorExample {json} Email or Phone Exists
   *     HTTP/1.1 400 Bad Request
   *     {
   *       "error": true,
   *       "message": "Email already in use, please provide a unique email"
   *     }
   *
   * @apiErrorExample {json} Invalid Date Format
   *     HTTP/1.1 400 Bad Request
   *     {
   *       "error": true,
   *       "message": "Invalid date of birth format. Use DD/MM/YYYY."
   *     }
   *
   * @apiErrorExample {json} Server Error
   *     HTTP/1.1 500 Internal Server Error
   *     {
   *       "error": true,
   *       "Error": "An error message"
   *     }
   */

  async createAdmin(req, res) {
    try {
      const {
        firstName,
        lastName,
        phone,
        email,
        address,
        gender,
        dob,
        profileImage,
        joinDate,
        bankDetails,
        signature,
      } = req.body;

      if (req.user.isSuperAdmin !== true) {
        return res
          .status(400)
          .json({ error: false, reason: "You are not superadmin" });
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
          .json({ error: true, reason: "email is required" });
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
      const existSchool = await School.findOne({ _id: req.params.id })
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
        _school: existSchool._id,
        _addedBy: req.user.id,
        joinDate: joinDate !== undefined ? joinDate : Date.now(),
        signature,
        username,
        phone,
        password,
        loginType: "admin",
        bankDetails,
        bankAdded: bankDetails !== undefined ? true : false,
        isActive: true,
        address,
        isSuperAdmin: false,
        profileImage,
      });

      if (user.email !== undefined) {
        try {
          await mail("admin-welcome", {
            to: user.email,
            subject: `Welcome to ${existSchool.name}`,
            locals: {
              username,
              firstName,
              password,
              schoolName: existSchool.name,
            },
          });
        } catch (error) {
          console.error(error).message;
          return res.status(400).json({ error: true, Error: error.message });
        }
      }

      const response = await User.findOne({ email: user.email }).select(
        "-forgotpassword -password -bankDetails"
      );

      return res.status(200).json({ error: true, user: response });
    } catch (error) {
      return res.status(500).json({ error: true, Error: error.message });
    }
  },
};
