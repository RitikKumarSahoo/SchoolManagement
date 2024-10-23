const jwt = require("jsonwebtoken");

const User = require("../../../models/user");

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
        loginType: user.loginType,
      };
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
   * @apiParam {String} [address] The new address of the admin.
   * @apiParam {String} [gender] Gender of the admin.
   * @apiParam {Date}   [dob] The DOB of the admin.
   * @apiParam {String} [address] address of the admin
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
      const { firstName, lastName, phone, email, address, gender, dob } =
        req.body;
      const { loginType } = req.user;

      if (loginType !== "admin") {
        return res
          .status(400)
          .json({ error: true, reason: "You are not admin" });
      }
      const admin = await User.findOne({
        _id: req.params.id,
        loginType: "admin",
      });

      if (admin === null) {
        return res.status(400).json({ error: true, reason: "Admin not found" });
      }
      if (firstName !== undefined) admin.firstName = firstName;
      if (lastName !== undefined) admin.lastName = lastName;
      if (phone !== undefined) admin.phone = phone;
      if (email !== undefined) admin.email = email;
      if (address !== undefined) admin.address = address;
      if (gender !== undefined) admin.gender = gender;
      if (dob !== undefined) admin.dob = dob;
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
