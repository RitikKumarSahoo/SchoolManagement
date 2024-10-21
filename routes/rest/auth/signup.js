const User = require("../../../models/user");
const randomstring = require("randomstring");
const mail = require("../../../lib/mail");
const School = require("../../../models/school");
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
   * @api {post} /admin/create Create Admin
   * @apiName CreateAdmin
   * @apiGroup Admin
   *
   * @apiHeader {String} Authorization Bearer token of the super admin.
   *
   * @apiParam {String} name Name of the school.
   * @apiParam {Object} schoolAddress School address object.
   * @apiParam {String} schoolAddress.city City of the school.
   * @apiParam {String} schoolAddress.state State of the school.
   * @apiParam {String} schoolAddress.country Country of the school.
   * @apiParam {String} schoolAddress.pinCode Pin code of the school.
   * @apiParam {Object} contact Contact information object.
   * @apiParam {String} contact.phoneNo Phone number for the school.
   * @apiParam {String} contact.email Email address for the school.
   * @apiParam {String} contact.website Website of the school.
   * @apiParam {Object} location Location object.
   * @apiParam {String} location.type Type of location (e.g., Point).
   * @apiParam {Number[]} location.coordinates Coordinates of the school (longitude, latitude).
   * @apiParam {String} email Admin's email address.
   * @apiParam {String} firstName Admin's first name.
   * @apiParam {String} lastName Admin's last name.
   * @apiParam {String} dob Admin's date of birth.
   * @apiParam {String} gender Admin's gender.
   * @apiParam {String} phone Admin's phone number.
   *
   * @apiSuccess {Boolean} error Indicates if there was an error.
   * @apiSuccess {String} message Success message.
   * @apiSuccess {Object} response The created admin object.
   *
   * @apiError (400) BadRequest School name is required.
   * @apiError (400) BadRequest School address is required.
   * @apiError (400) BadRequest School contact is required.
   * @apiError (400) BadRequest Email is required.
   * @apiError (400) BadRequest First name is required.
   * @apiError (400) BadRequest Last name is required.
   * @apiError (400) BadRequest Admin email is required.
   * @apiError (400) BadRequest Admin with this email already exists.
   *
   * @apiError (500) InternalServerError Unexpected error occurred.
   *
   * @apiExample {json} Request-Example:
   * {
   *   "name": "schoolXYZ",
   *   "schoolAddress": {
   *     "city": "Greenwood",
   *     "state": "California",
   *     "country": "USA",
   *     "pinCode": "90210"
   *   },
   *   "contact": {
   *     "phoneNo": "+1-f sjdfndsf",
   *     "email": "info@greenwoodhigh.edu",
   *     "website": "http://www.greenwoodhigh.edu"
   *   },
   *   "location": {
   *     "type": "Point",
   *     "coordinates": [21.418325060918168, 84.02980772446274]
   *   },
   *   "email": "sumanr@logic-square.com",
   *   "firstName": "suman",
   *   "lastName": "rana",
   *   "dob": "12/08/2001",
   *   "gender": "Male",
   *   "phone": "9668123855"
   * }
   *
   * @apiExample {json} Success-Response:
   * {
   *   "error": false,
   *   "message": "Admin successfully created.",
   *   "response": {
   *     "_id": "someAdminId",
   *     "username": "sumxyz555",
   *     "email": "sumanr@logic-square.com",
   *     "loginType": "admin",
   *     "firstName": "suman",
   *     "lastName": "rana",
   *     "isAdmin": true,
   *     "isSuperAdmin": false,
   *     "dob": "12/08/2001",
   *     "isActive": true,
   *     "_school": "someSchoolId",
   *     "phone": "9668123855",
   *     "gender": "Male",
   *     "address": null,
   *     "createdAt": "2024-10-21T00:00:00.000Z",
   *     "updatedAt": "2024-10-21T00:00:00.000Z"
   *   }
   * }
   */

  async createAdmin(req, res) {
    try {
      const {
        name,
        schoolAddress,
        contact,
        location,
        imageUrl,
        email,
        firstName,
        lastName,
        phone,
        dob,
        gender,
        address,
      } = req.body;
      const { isSuperAdmin } = req.user;
      if (isSuperAdmin !== true) {
        return res
          .status(400)
          .json({ error: true, reason: "you are not superadmin" });
      }
      if (name === undefined) {
        return res
          .status(400)
          .json({ error: true, reason: "school name is required" });
      }
      if (schoolAddress === undefined) {
        return res
          .status(400)
          .json({ error: true, reason: "school address is required" });
      }
      if (contact === undefined) {
        return res
          .status(400)
          .json({ error: true, reason: "school contact is required" });
      }
      if (email === undefined) {
        return res
          .status(400)
          .json({ error: true, reason: "email is required" });
      }
      if (firstName === undefined) {
        return res
          .status(400)
          .json({ error: true, reason: "firstName is required" });
      }
      if (lastName === undefined) {
        return res
          .status(400)
          .json({ error: true, reason: "lastName is required" });
      }
      if (phone === undefined) {
        return res
          .status(400)
          .json({ error: true, reason: "admin email is required" });
      }

      const existingAdmin = await User.findOne({ email });
      if (existingAdmin) {
        return res.status(400).json({
          error: true,
          message: "Admin with this email already exists.",
        });
      }

      const randomNumber = Math.floor(1000 + Math.random() * 9000);
      const registrationNumber = `REG${randomNumber}`;

      //create a new school
      const newSchool = await School.create({
        name,
        address: schoolAddress,
        contact,
        location,
        imageUrl,
        registrationNumber,
      });

      // Check if the admin already exists

      const username =
        firstName.slice(0, 3) + newSchool.name.slice(0, 3) + phone.slice(-3);

      const password = generateCustomPassword();

      const response = await User.create({
        username,
        email,
        password,
        firstName,
        lastName,
        loginType: "admin",
        isAdmin: true,
        isSuperAdmin: false,
        dob,
        isActive: true,
        _school: newSchool._id,
        phone,
        gender,
        address,
      });

      await mail("admin-welcome", {
        to: email,
        subject: `Welcome to ${newSchool.name}`,
        locals: {
          username,
          firstName,
          password,
          schoolName: newSchool.name,
        },
      });

      return res.status(201).json({
        error: false,
        message: "Admin successfully created.",
        response,
      });
    } catch (error) {
      return res.status(500).json({ error: true, message: error.message });
    }
  },

  /**
   * @api {get} /admin/getAll Get all admins
   * @apiName GetAllAdmins
   * @apiGroup Admin
   * @apiPermission SuperAdmin
   *
   * @apiDescription Fetch all admin users
   *
   * @apiHeader {String} Authorization Bearer token for authentication.
   *
   * @apiSuccessExample {json} Success Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "error": false,
   *       "admins": [
   *         {
   *           "_id": "61234abcd5678ef901234567",
   *           "name": "John Doe",
   *           "email": "john.doe@example.com",
   *           "loginType": "admin",
   *           "createdAt": "2024-09-30T12:30:45.123Z",
   *           "updatedAt": "2024-10-01T14:22:05.456Z"
   *         },
   *         {
   *           "_id": "62345bcde6789fg012345678",
   *           "name": "Jane Smith",
   *           "email": "jane.smith@example.com",
   *           "loginType": "admin",
   *           "createdAt": "2024-08-20T09:45:15.123Z",
   *           "updatedAt": "2024-10-01T11:10:05.789Z"
   *         }
   *       ]
   *     }
   *
   * @apiError {Boolean} error Status of the request (true if an error occurred).
   * @apiError {String} reason Reason for the error if the user is not a super admin.
   *
   * @apiErrorExample {json} Unauthorized Access:
   *     HTTP/1.1 400 Bad Request
   *     {
   *       "error": true,
   *       "reason": "You are not superAdmin"
   *     }
   *
   * @apiErrorExample {json} Internal Server Error:
   *     HTTP/1.1 500 Internal Server Error
   *     {
   *       "error": true,
   *       "Error": "Some error message"
   *     }
   */

  async getAllAdmin(req, res) {
    try {
      const { isSuperAdmin } = req.user;

      if (isSuperAdmin !== true) {
        return res
          .status(400)
          .json({ error: true, reason: "You are not superAdmin" });
      }

      const admins = await User.find({
        loginType: "admin",
        isSuperAdmin: false,
      }).select("-password -forgotpassword -isSuperAdmin");

      const totalAdmins = await User.countDocuments({
        loginType: "admin",
        isSuperAdmin: false,
      });

      return res.status(200).json({ error: false, admins, totalAdmins });
    } catch (error) {
      return res.status(500).json({ error: true, Error: error });
    }
  },

  /**
   * @api {get} /admin/get/:id Get admin by ID
   * @apiName GetAdmin
   * @apiGroup Admin
   * @apiPermission SuperAdmin
   *
   * @apiDescription Fetch a specific admin's details by their ID
   *
   * @apiHeader {String} Authorization Bearer token for authentication.
   *
   * @apiParam {String} id Admin's unique ID.
   *
   * @apiSuccessExample {json} Success Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "error": false,
   *       "admin": {
   *         "_id": "61234abcd5678ef901234567",
   *         "name": "John Doe",
   *         "email": "john.doe@example.com",
   *         "loginType": "admin",
   *         "createdAt": "2024-09-30T12:30:45.123Z",
   *         "updatedAt": "2024-10-01T14:22:05.456Z"
   *       }
   *     }
   *
   * @apiError {Boolean} error Status of the request (true if an error occurred).
   * @apiError {String} reason Reason for the error if the user is not a super admin.
   *
   * @apiErrorExample {json} Unauthorized Access:
   *     HTTP/1.1 400 Bad Request
   *     {
   *       "error": true,
   *       "reason": "You are not superAdmin"
   *     }
   *
   * @apiErrorExample {json} Internal Server Error:
   *     HTTP/1.1 500 Internal Server Error
   *     {
   *       "error": true,
   *       "Error": "Some error message"
   *     }
   */

  async get(req, res) {
    try {
      const { isSuperAdmin } = req.user;

      if (isSuperAdmin !== true) {
        return res
          .status(400)
          .json({ error: false, reason: "You are not superAdmin" });
      }

      const admin = await User.findOne({ _id: req.params.id }).select(
        "-password -isSuperAdmin -forgotpassword"
      );

      return res.status(200).json({ error: false, admin });
    } catch (error) {
      return res.status(500).json({ error: true, Error: error });
    }
  },

  async deleteAdmin(req, res) {
    try {
      const { isSuperAdmin } = req.user;

      // Check if the user is a superadmin
      if (isSuperAdmin === false) {
        return res.status(403).json({
          error: true,
          reason: "You are not authorized to delete an admin",
        });
      }

      const admin = await User.findOne({
        _id: req.params.id,
        loginType: "admin",
      });

      if (admin === null) {
        return res.status(404).json({ error: true, reason: "Admin not found" });
      }

      await admin.deleteOne({ _id: req.params.id });

      return res.status(200).json({
        error: false,
        message: "Admin deleted successfully.",
      });
    } catch (error) {
      return res.status(500).json({ error: true, message: error.message });
    }
  },
};
