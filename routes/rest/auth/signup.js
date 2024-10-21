const User = require("../../../models/user");
const randomstring = require("randomstring");
const mail = require("../../../lib/mail");
const School = require("../../../models/school");
const stripe = require("stripe")(
  "sk_test_51Pt2xx1xyS6eHcGHSrfLdSfyQQESKMatwXTA28TYmUMCXpnI2zjv1auMtdIZSyV771lqArWjZlXzFXE9yt87mbdS00ypiNeR0x"
);
module.exports = {
  /**
   * @api {post} /admin/signup Sign Up Admin by SuperAdmin
   * @apiName SignupAdmin
   * @apiGroup Admin
   * @apiVersion 1.0.0
   * @apiDescription Allows a SuperAdmin to create a new admin user.
   *
   * @apiHeader {String} Authorization SuperAdmin's unique access token (JWT).
   *
   * @apiParam {String} username Username for the new admin.
   * @apiParam {String} email Email address for the new admin.
   * @apiParam {String} firstName First name of the new admin.
   * @apiParam {String} lastName Last name of the new admin.
   * @apiParam {String} phone Phone number of the new admin.
   * @apiParam {String} dob Date of birth of the new admin (YYYY-MM-DD format).
   * @apiParam {String} _school School ID for the new admin.
   * @apiParam {String} gender Gender of the admin
   * @apiParam {String} address address of the admin
   *
   * @apiSuccess {Boolean} error Whether there was an error (false if successful).
   * @apiSuccess {String} message Success message.
   * @apiSuccess {Object} response The newly created admin user object.
   *
   * @apiError (400) {Boolean} error Whether there was an error.
   * @apiError (400) {String} reason Reason for the error (if applicable).
   *
   * @apiErrorExample {json} Error-Response:
   *     HTTP/1.1 400 Bad Request
   *     {
   *       "error": true,
   *       "reason": "you are not superadmin"
   *     }
   *
   * @apiError (500) {Boolean} error Whether there was an internal server error.
   * @apiError (500) {String} message Error message (if internal error occurs).
   *
   * @apiErrorExample {json} Error-Response:
   *     HTTP/1.1 500 Internal Server Error
   *     {
   *       "error": true,
   *       "message": "Internal Server Error"
   *     }
   */

  async signupByAdmin(req, res) {
    try {
      const {
        username,
        email,
        firstName,
        lastName,
        phone,
        _school,
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
      // Validate input
      if (!username || !email || !firstName || !lastName || !_school || !dob) {
        return res
          .status(400)
          .json({ error: true, message: "All fields are required." });
      }

      // Check if the admin already exists
      const existingAdmin = await User.findOne({ email });
      if (existingAdmin) {
        return res.status(400).json({
          error: true,
          message: "Admin with this email already exists.",
        });
      }
      const existSchool = await School.findOne({ _id: _school }).select("name");
      if (existSchool === null) {
        return res
          .status(400)
          .json({ error: true, reason: "school not found" });
      }
      const customer = await stripe.customers.create({
        email,
      });

      const randomStr = randomstring.generate({
        length: 8,
        charset: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
      });
      const password = randomStr;

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
        _school,
        phone,
        customerStripeId: customer.id,
        messagingEnabled: true,
        gender,
        address,
      });

      await mail("admin-welcome", {
        to: email,
        subject: `Welcome to ${existSchool.name}`,
        locals: {
          email,
          firstName,
          password,
          schoolName: existSchool.name,
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
