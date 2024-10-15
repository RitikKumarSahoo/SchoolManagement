const jwt = require("jsonwebtoken");

const User = require("../../../models/user");

module.exports = {
  /**
   * @api {post} /login User Login
   * @apiVersion 1.0.0
   * @apiName Login
   * @apiGroup Auth
   * @apiPermission None
   *
   * @apiDescription This endpoint allows users (students, teachers, admins, and super admins) to log in to the system. The endpoint checks for required credentials based on the `loginType` and generates a token upon successful login.
   *
   * @apiParam {String} loginType Type of user logging in, one of "student", "teacher", "admin".
   * @apiParam {String} [username] Username of the student (required if loginType is "student").
   * @apiParam {String} [email] Email of the user (required if loginType is "admin" or "teacher").
   * @apiParam {String} password Password of the user.
   *
   * @apiExample {json} Request-Example-1:
   *     {
   *       "loginType": "admin",
   *       "email": "admin@example.com",
   *       "password": "yourpassword"
   *     }
   * @apiExample {json} Request-Example-2:
   *     {
   *       "loginType": "student",
   *       "username": "username",
   *       "password": "yourpassword"
   *     }
   *
   * @apiSuccess {Boolean} error False indicating no error.
   * @apiSuccess {String} token JWT token generated after successful login.
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "error": false,
   *       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   *     }
   *
   * @apiError (400) MissingFields Fields `loginType` and `password` are mandatory.
   * @apiError (400) MissingUsername Field `username` is required for `loginType` "student".
   * @apiError (400) MissingEmail Field `email` is required for `loginType` "admin" or "teacher".
   * @apiError (404) UserNotFound The user with the provided credentials was not found.
   * @apiError (403) UserInactive The user is inactive and cannot log in.
   * @apiError (500) InternalServerError Error occurred during login.
   *
   * @apiErrorExample Error-Response:
   *     HTTP/1.1 404 Not Found
   *     {
   *       "error": true,
   *       "reason": "User Not Found"
   *     }
   */
  async post(req, res) {
    try {
      const { email, password, username, loginType } = req.body;
      if (loginType === undefined || password === undefined) {
        return res.status(400).json({
          error: true,
          reason: "Fields `loginType` and `password` are mandatory",
        });
      }
      let query = {};
      if (loginType === "student") {
        if (username === undefined) {
          return res
            .status(400)
            .json({ error: true, reason: "Field `username` is mandatory" });
        }
        query = { username: username, loginType: "student" };
      }

      if (loginType === "admin" || loginType === "teacher") {
        if (email === undefined) {
          return res
            .status(400)
            .json({ error: true, reason: "Field `email` is mandatory" });
        }
        query = { email: email, loginType: loginType };
      }

      const user = await User.findOne(query).exec();

      if (user === null) throw new Error("User Not Found");
      if (user.isActive === false) throw new Error("User Inactive");

      // check pass
      await user.comparePassword(password);
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
        loginType: user.loginType,
      };
      const token = jwt.sign(payload, process.env.SECRET, {
        expiresIn: 3600 * 24 * 30, // 1 month
      });
      return res.json({
        error: false,
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
   * @api {put} /admin/update Update Admin Profile
   * @apiName UpdateAdminProfile
   * @apiGroup Admin
   * @apiVersion 1.0.0
   * @apiPermission admin
   *
   * @apiDescription This endpoint allows an admin to update their profile details, such as first name, last name, and phone number.
   *
   * @apiHeader {String} Authorization Bearer token authorization.
   *
   * @apiParam {String} [firstName] The new first name of the admin.
   * @apiParam {String} [lastName] The new last name of the admin.
   * @apiParam {String} [phone] The new phone number of the admin.
   * @apiParam {String} [email] The new email of the admin.
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
      const { firstName, lastName, phone, email } = req.body;
      const { loginType, id } = req.user;

      if (loginType !== "admin") {
        return res
          .status(400)
          .json({ error: true, reason: "You are not admin" });
      }
      const admin = await User.findOne({ _id: id });

      if (admin === null) {
        return res.status(400).json({ error: true, reason: "Admin not found" });
      }
      if (firstName !== undefined) admin.firstName = firstName;
      if (lastName !== undefined) admin.lastName = lastName;
      if (phone !== undefined) admin.phone = phone;
      if (email !== undefined) admin.email = email;
      await admin.save();

      return res.status(200).json({
        error: false,
        message: "Admin profile updated successfully.",
      });
    } catch (error) {
      return res.status(500).json({ error: true, message: error.message });
    }
  },
};
