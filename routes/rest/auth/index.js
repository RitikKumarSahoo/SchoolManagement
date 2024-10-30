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
        rollNo,
        _class,
        guardian,
        joinDate,
        leaveDate,
        _school,
      } = req.body;
      const { isSuperAdmin, loginType } = req.user;

      if (isSuperAdmin === true) {
        const user = await User.findOne({
          _id: req.params.id,
        });

        if (user === null) {
          return res.status(400).json({
            error: true,
            reason: "You are not authorized to update this user",
          });
        }

        if (firstName !== undefined) user.firstName = firstName;
        if (lastName !== undefined) user.lastName = lastName;
        if (phone !== undefined) user.phone = phone;
        if (email !== undefined) user.email = email;
        if (address !== undefined) user.address = address;
        if (gender !== undefined) user.gender = gender;
        if (dob !== undefined) user.dob = dob;
        if (profileImage !== undefined) user.profileImage = profileImage;
        if (guardian !== undefined) user.guardian = guardian;
        if (_school !== undefined) user._school = _school;
        if (joinDate !== undefined) user.joinDate = joinDate;
        if (leaveDate !== undefined) user.leaveDate = leaveDate;

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
        if (address !== undefined) user.address = address;
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
};
